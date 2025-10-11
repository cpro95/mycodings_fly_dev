import fs from "fs-extra";
import path from "path";
import inquirer from "inquirer";
import slugify from "lodash.kebabcase";

async function go() {
  console.log("\nLet's create a new life contents 💿\n");

  const blogsPath = path.resolve(process.cwd(), "content", "life");

  if (!fs.existsSync(blogsPath)) {
    fs.mkdirSync(blogsPath);
  }

  const blogs = fs
    .readdirSync(blogsPath)
    .map((blog) => blog.replace(/\.md$/, ""));

  const { slug, title, summary, tags, draft } = await inquirer.prompt([
    {
      type: "input",
      name: "slug",
      message: "What is the slug for the blog?",
      validate: (input) => {
        if (!input) {
          return "Enter a valid slug for the blog.";
        }
        if (blogs.includes(input)) {
          return `Blog with slug "${input}" already exists, enter another slug.`;
        }
        return true;
      },
    },
    {
      type: "input",
      name: "title",
      message: "What is the title of the blog?",
      validate: (input) => {
        if (!input) {
          return "Enter a valid title for the blog.";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "summary",
      message: "Enter the blog summary",
      filter: (input) => input.trim(),
      validate: (input) => {
        if (input.trim().length === 0) {
          return "Enter a summary for the blog";
        }
        return true;
      },
    },
    {
      type: "input",
      name: "tags",
      message: "Enter the blog tags (comma separated)",
      filter: (input) => input.trim(),
      validate: (input) => {
        if (input.trim().length === 0) {
          return "Enter a tag";
        }
        return true;
      },
    },
    {
      type: "list",
      name: "draft",
      message: "Is the blog ready to be published?",
      choices: [
        { name: "Publish", value: false },
        { name: "Draft", value: true },
      ],
    },
  ]);

  const data = `---
slug: ${slug}
title: "${title}"
summary: "${summary}"
date: ${new Date().toISOString()}
draft: ${draft}
weight: 50
tags: [${tags
    .split(/, ?/)
    .map((tag) => `"${tag.trim()}"`)
    .join(", ")}]
contributors: []
---

`;

  const filePath = path.resolve(blogsPath, `${slug}.md`);
  const relativePath = path.relative(process.cwd(), filePath);
  fs.writeFileSync(filePath, data);

  console.log(
    `\nLife blog created 🚀\n\`cd\` into ${relativePath}\nOpen it in your favorite text editor, and get started!\n`
  );
}

go().catch((err) => {
  console.error(err);
  process.exit(1);
});
