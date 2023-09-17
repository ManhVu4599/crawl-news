import { Injectable } from '@nestjs/common';
import { NewsDocument } from '../schemas/news.schema';
import mongoose, { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import puppeteer from 'puppeteer';
import { ListNewsDto } from '../dtos/listNews.dto';
import { NewsDto } from '../dtos/news.dto';
import { TopicDocument } from '../schemas/topic.schema';
import { SubTopicDocument } from '../schemas/subtopic.shema';
import { crawlDetailDto } from '../dtos/crawlDetail.dto';
const cheerio = require('cheerio');

@Injectable()
export class NewsService {
    constructor(
        @InjectModel('News') private readonly model: Model<NewsDocument>,
        @InjectModel('Topic') private readonly topicModel: Model<TopicDocument>,
        @InjectModel('SubTopic') private readonly subTopicModel: Model<SubTopicDocument>
    ) { }

    async listNews(query: ListNewsDto) {
        try {
            const { limit, page, topic_id, subtopic_id } = query
            const match = {};
            if (topic_id) {
                match['topic_id'] =  new mongoose.Types.ObjectId(topic_id);
            }
            if (subtopic_id) {
                match['subTopic_id'] = new mongoose.Types.ObjectId(subtopic_id);
            }
            const skip = Number(limit) * (Number(page + 1));
            const q: any = [
                {
                    $lookup: {
                        from: 'topics',
                        localField: 'topic_id',
                        foreignField: '_id',
                        as: 'topic',
                    },
                },
                {
                    $lookup: {
                        from: 'subtopics',
                        localField: 'subTopic_id',
                        foreignField: '_id',
                        as: 'subtopic',
                    },
                },
                { $sort: { time: -1 } },
                {
                    $facet: {
                        total: [
                            {
                                $count: 'createdAt',
                            },
                        ],
                        data: [
                            {
                                $addFields: {
                                    _id: '$_id',
                                },
                            },
                        ],
                    },
                },
                {
                    $unwind: '$total',
                },
                {
                    $project: {
                        items: {
                            $slice: [
                                '$data',
                                {
                                    $ifNull: [Number(limit), '$total.createdAt'],
                                },
                            ],
                        },
                        totalItems: '$total.createdAt',
                        itemsPerPage: {
                            $literal: +limit,
                        },
                        totalPages: {
                            $ceil: {
                                $divide: ['$total.createdAt', Number(limit)],
                            },
                        },
                        currentPage: {
                            $literal: +skip / Number(limit) + 1,
                        },
                    },
                },
            ];
            if (Object.keys(match).length) {
                q.unshift({
                    $match: match,
                });
            }
            console.log(q);
            const result = await this.model
                .aggregate(q)
                .exec();
            console.log(result);
            if (result) return result[0]
            return {message: "Not found"}
        } catch (e) {
            throw new Error(e);
        }
    }

    async crawlList(data: any) {
        try {
            const url = data.url || 'https://dantri.com.vn/'
            const card = data.card || 'article[class*="article-item"]'
            const card_link = data.card_link || 'a';
            const card_title = data.card_title || 'a';
            const card_img = data.card_img || 'img';
            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto(url);

            const html = await page.content();
            const $ = cheerio.load(html);
            const news = [];
            $(card).each(function () {
                const link = `${url}${$(this).find(card_link).attr('href')}`;
                const title = $(this).find(card_title).text();
                const image = $(this).find(card_img).attr('src');
                const source = url;
                news.push({ link, title, image, source })
            });
            await browser.close();
            console.log(news);
            await this.model.insertMany(news);
            return "crawl done"
        } catch (e) {
            throw new Error(e);
        }

    }

    async crawlDetail(data: crawlDetailDto, id: string) {
        try {
            const news = await this.model.findById(id);
            if(!news) {
                throw new Error("news not found");
            }
            const url = news.link || 'https://dantri.com.vn/'
            const card = data.card || 'article[class="singular-container"]'
            const card_content = data.card_content || '.singular-content';
            const card_topic = data.card_topic || 'ul.breadcrumbs > li';
            const card_topic_title = data.card_topic_title || 'a';
            const card_img = data.card_img || 'figure[class*="image align-center"]';
            const card_time = data.card_time || '.author-time';

            const browser = await puppeteer.launch({ headless: false });
            const page = await browser.newPage();
            await page.goto(url);

            const html = await page.content();
            const $ = cheerio.load(html);
            let content = ''
            $(card).each(function () {
                content = $(this).find(card_content).text();
            })
            const breadcrumbs = [];
            $(card_topic).each(function () {
                breadcrumbs.push($(this).find(card_topic_title).attr('title'));
            })
            const listImage = [];
            $(card_img).each(function () {
                listImage.push($(this).find('img').attr('src'));
            })

            let time;
            $(card_time).each(function () {
                time = $(this).attr('datetime');
            })

            await browser.close();
            let topic, subTopic;
            if (breadcrumbs[0]) {
                topic = await this.topicModel.findOne({ name: breadcrumbs[0] });
                if (!topic) {
                    topic = new this.topicModel({ name: breadcrumbs[0] });
                    await topic.save();
                }
                if (breadcrumbs[1]) {
                    subTopic = await this.subTopicModel.findOne({ name: breadcrumbs[1] });
                    if (!subTopic) {
                        subTopic = new this.subTopicModel({ name: breadcrumbs[1], topic_id: topic._id })
                        await subTopic.save();
                    }
                }

            }
            const newsUpdateData = {
                content,
                listImage,
                topic_id: topic,
                subTopic_id: subTopic,
                time,
            }
            console.log(newsUpdateData)
            const newsUpdate = await this.model.updateOne({ _id: id }, newsUpdateData);
            return newsUpdate
        } catch (e) {
            throw new Error(e);
        }
    }

    create(data: NewsDto) {
        const news = new this.model(data);
        return news.save();
    }
}
