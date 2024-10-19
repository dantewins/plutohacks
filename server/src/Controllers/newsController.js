const asyncHandler = require("express-async-handler");
const { clerkClient } = require("@clerk/express");
const { OpenAI } = require("openai");
const axios = require("axios");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// helper function to randomly select 20 articles
const getRandomArticles = (articles, count = 20) => {
  const shuffled = articles.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Fetch news
const fetchNews = asyncHandler(async (req, res) => {
  try {
    // fetch
    const apiUrl = `https://newsapi.org/v2/everything?q=emergency%20preparedness&apiKey=${process.env.NEWS_API_KEY}`;
    const newsResponse = await axios.get(apiUrl);

    // extract
    const articles = newsResponse.data.articles;

    // random selected
    const randomArticles = getRandomArticles(articles, 20);

    // format
    const articleSummaries = randomArticles
      .map((article, index) => {
        return `Article ${index + 1}: ${article.title}. Source: ${article.source.name}. Description: ${article.description}`;
      })
      .join("\n");

    // use gpt-4 to rank
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an AI that filters factual, reliable, and non-biased news articles related to emergency preparedness.",
        },
        {
          role: "user",
          content: `Here are 20 articles related to emergency preparedness:\n\n${articleSummaries}\n\nPlease be extremely strict and harsh in filtering these articles. Only choose articles that are completely non-biased, purely factual, and from reliable, well-established sources. Discard any article that shows even the slightest hint of opinion, bias, or unreliable information. Respond with the numerical positions (1-20) of only the most unbiased and factual articles in a comma-separated format, e.g., "1, 5, 12, 18".`,
        },
      ],
    });

    // get response with article positions
    const positionsText = completion.choices[0].message.content;
    const positions = positionsText
      .split(",")
      .map((position) => parseInt(position.trim(), 10)); // Extract and parse positions

    // filter articles
    const reliableArticles = positions.map(
      (position) => randomArticles[position - 1], // Correct for 1-based indexing
    );

    // return filtered articles
    res.status(200).json({
      success: true,
      reliableArticles,
    });
  } catch (error) {
    console.error("Error fetching or processing news:", error);
    res.status(500).json({ success: false, message: "Error fetching news" });
  }
});

module.exports = {
  fetchNews,
};
