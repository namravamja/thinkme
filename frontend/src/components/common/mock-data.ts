import type { Blog, Comment, User } from "@/types"

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-15T10:00:00Z",
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-10T10:00:00Z",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-05T10:00:00Z",
  },
  {
    id: "4",
    name: "David Kim",
    email: "david@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2024-01-01T10:00:00Z",
  },
  {
    id: "5",
    name: "Alex Thompson",
    email: "alex@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2023-12-20T10:00:00Z",
  },
  {
    id: "6",
    name: "Jessica Lee",
    email: "jessica@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    createdAt: "2023-12-15T10:00:00Z",
  },
]

export const mockBlogs: Blog[] = [
  {
    id: "1",
    title: "The Future of Web Development: What's Coming in 2024",
    excerpt:
      "Exploring the latest trends and technologies that will shape web development in the coming year, from AI integration to new frameworks.",
    content: `The web development landscape is constantly evolving, and 2024 promises to bring some exciting changes. From the rise of AI-powered development tools to new frameworks that promise better performance and developer experience, there's a lot to be excited about.

One of the most significant trends we're seeing is the integration of artificial intelligence into the development workflow. Tools like GitHub Copilot and ChatGPT are already changing how developers write code, but we're just scratching the surface.

Another major trend is the continued evolution of JavaScript frameworks. React Server Components are becoming more mainstream, while new frameworks like Solid.js and Qwik are gaining traction for their innovative approaches to reactivity and performance.

The rise of edge computing is also changing how we think about web applications. With platforms like Vercel Edge Functions and Cloudflare Workers, we can now run server-side code closer to our users, resulting in better performance and user experience.

Web Assembly (WASM) is another technology that's gaining momentum. It allows us to run high-performance code in the browser, opening up new possibilities for web applications that were previously only possible with native apps.

Finally, the focus on web performance and Core Web Vitals continues to be crucial. Google's emphasis on page experience as a ranking factor means that developers need to pay more attention to metrics like Largest Contentful Paint (LCP), First Input Delay (FID), and Cumulative Layout Shift (CLS).`,
    category: "Technology",
    tags: ["Web Development", "JavaScript", "AI", "Performance"],
    author: {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
    likesCount: 42,
    commentsCount: 8,
    readTime: 5,
    isLiked: false,
  },
  {
    id: "2",
    title: "Mastering Modern CSS: Grid, Flexbox, and Beyond",
    excerpt: "A comprehensive guide to modern CSS layout techniques that every developer should know in 2024.",
    content: `CSS has come a long way from the days of float-based layouts and clearfix hacks. Modern CSS provides powerful tools for creating complex, responsive layouts with ease.

CSS Grid is perhaps the most powerful layout system available in CSS. It allows you to create two-dimensional layouts with precise control over both rows and columns. Unlike Flexbox, which is primarily one-dimensional, Grid excels at creating complex layouts where you need to control both axes.

Flexbox remains incredibly useful for one-dimensional layouts. It's perfect for navigation bars, card layouts, and centering content. The combination of Grid and Flexbox gives you all the tools you need for modern web layouts.

Container queries are another exciting addition to CSS. They allow you to apply styles based on the size of a container rather than the viewport, making components truly responsive and reusable.

CSS custom properties (variables) have revolutionized how we write maintainable CSS. They enable dynamic theming, reduce repetition, and make our stylesheets more flexible.

The :has() pseudo-class, often called the "parent selector," opens up new possibilities for styling based on an element's children. This has been a long-requested feature that finally landed in browsers.

Modern CSS also includes powerful features like CSS Houdini, which allows you to extend CSS with JavaScript, and CSS-in-JS solutions that bring the power of JavaScript to styling.`,
    category: "Design",
    tags: ["CSS", "Layout", "Responsive Design", "Frontend"],
    author: {
      id: "2",
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-18T14:30:00Z",
    updatedAt: "2024-01-18T14:30:00Z",
    likesCount: 38,
    commentsCount: 12,
    readTime: 7,
    isLiked: false,
  },
  {
    id: "3",
    title: "Building Scalable React Applications: Best Practices",
    excerpt: "Learn how to structure and organize React applications for long-term maintainability and scalability.",
    content: `Building React applications that can scale with your team and requirements is both an art and a science. Here are the key principles and practices that will help you create maintainable React codebases.

Component composition is at the heart of scalable React applications. Instead of building monolithic components, break them down into smaller, focused components that do one thing well. This makes your code more testable, reusable, and easier to understand.

State management is crucial for larger applications. While React's built-in state is perfect for component-level state, you'll need a more robust solution for global state. Consider tools like Zustand, Redux Toolkit, or Jotai based on your needs.

Custom hooks are a powerful way to extract and reuse stateful logic. They help keep your components clean and focused on rendering while moving complex logic into reusable functions.

Proper folder structure becomes increasingly important as your application grows. Consider organizing by feature rather than by file type. This makes it easier to find related files and understand the codebase.

Performance optimization should be considered from the beginning. Use React.memo for expensive components, useMemo and useCallback for expensive calculations, and code splitting to reduce bundle sizes.

Testing is essential for maintaining confidence in your codebase. Write unit tests for your components and custom hooks, integration tests for user flows, and end-to-end tests for critical paths.

TypeScript can significantly improve the developer experience and catch errors early. It's especially valuable in larger codebases where the type safety helps prevent runtime errors.`,
    category: "Technology",
    tags: ["React", "JavaScript", "Architecture", "Best Practices"],
    author: {
      id: "3",
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-16T09:15:00Z",
    updatedAt: "2024-01-16T09:15:00Z",
    likesCount: 56,
    commentsCount: 15,
    readTime: 8,
    isLiked: true,
  },
  {
    id: "4",
    title: "The Art of Minimalist Design in Digital Products",
    excerpt:
      "Exploring how minimalist design principles can improve user experience and create more effective digital products.",
    content: `Minimalist design is more than just a trend—it's a philosophy that can dramatically improve the user experience of digital products. By focusing on what's essential and removing the unnecessary, we can create interfaces that are both beautiful and functional.

The principle of "less is more" applies perfectly to digital design. Every element on a screen should have a purpose. If it doesn't contribute to the user's goals or the overall experience, it should be removed.

White space, or negative space, is one of the most powerful tools in a minimalist designer's toolkit. It helps create visual hierarchy, improves readability, and gives the design room to breathe. Don't be afraid of empty space—it's not wasted space.

Typography plays a crucial role in minimalist design. Choose fonts that are clean and readable, and use a limited number of typefaces. Good typography can carry a design and communicate effectively without relying on decorative elements.

Color should be used purposefully in minimalist design. A limited color palette can be more impactful than a rainbow of colors. Use color to guide attention, convey meaning, and create emotional connections.

The user interface should be intuitive and self-explanatory. Users shouldn't need instructions to understand how to interact with your product. This requires careful consideration of information architecture and user flows.

Minimalist design doesn't mean boring design. You can still create engaging and delightful experiences while adhering to minimalist principles. The key is to focus on the essential elements that truly matter to your users.`,
    category: "Design",
    tags: ["UI/UX", "Minimalism", "Design Principles", "User Experience"],
    author: {
      id: "4",
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-14T16:45:00Z",
    updatedAt: "2024-01-14T16:45:00Z",
    likesCount: 29,
    commentsCount: 6,
    readTime: 6,
    isLiked: false,
  },
  {
    id: "5",
    title: "Understanding Async/Await in JavaScript",
    excerpt: "A deep dive into asynchronous JavaScript, from callbacks to promises to async/await syntax.",
    content: `Asynchronous programming is fundamental to JavaScript, but it can be one of the most challenging concepts for developers to master. Let's explore the evolution from callbacks to promises to async/await.

JavaScript is single-threaded, which means it can only execute one piece of code at a time. However, many operations in web development are asynchronous—like fetching data from an API, reading files, or waiting for user input.

Callbacks were the original solution for handling asynchronous operations in JavaScript. While they work, they can lead to "callback hell" when you have multiple nested asynchronous operations.

Promises were introduced to solve the problems with callbacks. They provide a cleaner way to handle asynchronous operations and avoid deeply nested code. A promise represents a value that may be available now, in the future, or never.

Async/await is syntactic sugar built on top of promises. It allows you to write asynchronous code that looks and behaves more like synchronous code, making it easier to read and understand.

Error handling with async/await is straightforward using try/catch blocks, which is more intuitive than promise rejection handling.

Understanding the event loop is crucial for mastering asynchronous JavaScript. The event loop is what allows JavaScript to perform non-blocking operations despite being single-threaded.

Modern JavaScript also includes features like Promise.all(), Promise.race(), and Promise.allSettled() for handling multiple asynchronous operations concurrently.`,
    category: "Technology",
    tags: ["JavaScript", "Async Programming", "Promises", "Web Development"],
    author: {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-12T11:20:00Z",
    updatedAt: "2024-01-12T11:20:00Z",
    likesCount: 34,
    commentsCount: 9,
    readTime: 4,
    isLiked: false,
  },
  {
    id: "6",
    title: "Sustainable Web Design: Building for the Planet",
    excerpt: "How web designers and developers can create more environmentally friendly digital experiences.",
    content: `The internet consumes a significant amount of energy, and as web professionals, we have a responsibility to consider the environmental impact of our digital creations. Sustainable web design is about creating websites that are not only user-friendly but also planet-friendly.

The carbon footprint of the internet is substantial. Every website visit, every image loaded, and every video streamed contributes to energy consumption. Data centers, networks, and user devices all consume electricity, much of which still comes from fossil fuels.

Optimizing performance is one of the most effective ways to reduce a website's environmental impact. Faster websites use less energy, both on the server side and on user devices. This means optimizing images, minifying code, and reducing HTTP requests.

Choosing green hosting providers can significantly reduce your website's carbon footprint. Many hosting companies now offer renewable energy-powered servers and carbon offset programs.

Efficient coding practices contribute to sustainability. Clean, efficient code runs faster and uses less processing power. This includes optimizing database queries, using efficient algorithms, and avoiding unnecessary JavaScript.

Image optimization is crucial for sustainable web design. Use modern image formats like WebP or AVIF, implement lazy loading, and serve appropriately sized images for different devices.

Consider the user journey and eliminate unnecessary pages or features. Every page that doesn't serve a clear purpose is wasted energy. Focus on what users actually need and remove the rest.

Dark mode isn't just a design trend—it can also save energy, especially on OLED screens. Consider offering a dark mode option for your users.`,
    category: "Design",
    tags: ["Sustainability", "Web Performance", "Green Tech", "Environment"],
    author: {
      id: "2",
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-10T13:10:00Z",
    updatedAt: "2024-01-10T13:10:00Z",
    likesCount: 22,
    commentsCount: 4,
    readTime: 5,
    isLiked: false,
  },
  {
    id: "7",
    title: "The Rise of AI in Software Development",
    excerpt: "How artificial intelligence is transforming the way we write, test, and deploy software.",
    content: `Artificial Intelligence is revolutionizing software development in ways we never imagined. From code generation to automated testing, AI tools are becoming indispensable parts of the modern developer's toolkit.

GitHub Copilot has been a game-changer for many developers. This AI-powered code completion tool can suggest entire functions, help with boilerplate code, and even assist with complex algorithms. It's like having a pair programming partner that never gets tired.

AI-powered testing tools are emerging that can automatically generate test cases, identify edge cases, and even predict where bugs are most likely to occur. This is particularly valuable for large codebases where manual testing becomes impractical.

Code review is another area where AI is making significant inroads. Tools can now analyze code for potential security vulnerabilities, performance issues, and adherence to coding standards, freeing up human reviewers to focus on higher-level architectural concerns.

Natural language processing is enabling developers to write code using plain English descriptions. Tools like OpenAI's Codex can translate human language into working code, making programming more accessible to non-technical users.

However, AI in development isn't without challenges. There are concerns about code quality, security implications of AI-generated code, and the potential for over-reliance on automated tools. Developers need to maintain their fundamental skills while leveraging AI as a powerful assistant.

The future likely holds even more integration between AI and development workflows, with intelligent IDEs that can predict what you're trying to build and suggest optimal implementations.`,
    category: "Technology",
    tags: ["AI", "Machine Learning", "Development Tools", "Automation"],
    author: {
      id: "5",
      name: "Alex Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-08T15:30:00Z",
    updatedAt: "2024-01-08T15:30:00Z",
    likesCount: 67,
    commentsCount: 23,
    readTime: 6,
    isLiked: true,
  },
  {
    id: "8",
    title: "Healthy Habits for Remote Developers",
    excerpt:
      "Essential tips for maintaining physical and mental health while working from home as a software developer.",
    content: `Working from home has become the norm for many developers, but it comes with unique health challenges. Long hours at a computer, irregular schedules, and social isolation can take a toll on both physical and mental well-being.

Ergonomics should be your first priority. Invest in a good chair, position your monitor at eye level, and ensure your keyboard and mouse are at the right height. Poor ergonomics can lead to repetitive strain injuries that can end careers.

The 20-20-20 rule is essential for eye health: every 20 minutes, look at something 20 feet away for at least 20 seconds. This helps reduce eye strain and prevents the development of computer vision syndrome.

Regular movement is crucial. Set reminders to stand and stretch every hour. Consider a standing desk or treadmill desk if possible. Even short walks around the house can help improve circulation and reduce the risk of blood clots.

Mental health is just as important as physical health. Remote work can be isolating, so make an effort to maintain social connections with colleagues and friends. Consider working from coffee shops or co-working spaces occasionally to change your environment.

Establish clear boundaries between work and personal time. When you work from home, it's easy for work to bleed into every aspect of your life. Set specific work hours and stick to them.

Nutrition often suffers when working from home. Plan your meals, keep healthy snacks on hand, and avoid the temptation to constantly graze throughout the day. Stay hydrated by keeping a water bottle at your desk.

Sleep hygiene is critical for cognitive function and overall health. Maintain a consistent sleep schedule, avoid screens before bedtime, and create a comfortable sleep environment.`,
    category: "Health",
    tags: ["Remote Work", "Health", "Wellness", "Work-Life Balance"],
    author: {
      id: "6",
      name: "Jessica Lee",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-06T09:45:00Z",
    updatedAt: "2024-01-06T09:45:00Z",
    likesCount: 45,
    commentsCount: 18,
    readTime: 7,
    isLiked: false,
  },
  {
    id: "9",
    title: "Building Your Personal Brand as a Developer",
    excerpt: "Strategies for establishing yourself as a thought leader in the tech industry and advancing your career.",
    content: `In today's competitive tech landscape, having strong technical skills isn't enough. Building a personal brand can set you apart from other developers and open doors to new opportunities.

Start with defining your niche. What are you passionate about? What unique perspective do you bring to the table? Whether it's frontend development, machine learning, or developer tools, having a clear focus helps you build authority in that area.

Content creation is one of the most effective ways to build your brand. This could be writing blog posts, creating YouTube videos, speaking at conferences, or contributing to open source projects. The key is consistency and providing value to your audience.

Social media, particularly Twitter and LinkedIn, are powerful platforms for developers. Share your learnings, engage with the community, and participate in discussions. Don't just promote your own content—be genuinely helpful and supportive of others.

Speaking at conferences and meetups can significantly boost your visibility. Start small with local meetups, then work your way up to larger conferences. Even virtual events can be valuable for building your reputation.

Open source contributions are highly valued in the developer community. Contributing to popular projects not only improves your skills but also demonstrates your ability to work with others and write quality code.

Networking is crucial, but it should be authentic. Focus on building genuine relationships rather than just collecting contacts. Attend industry events, join online communities, and don't be afraid to reach out to people you admire.

Remember that building a personal brand is a marathon, not a sprint. It takes time to establish credibility and build an audience. Be patient, stay consistent, and focus on providing value to others.`,
    category: "Business",
    tags: ["Career", "Personal Branding", "Networking", "Professional Development"],
    author: {
      id: "3",
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-04T12:15:00Z",
    updatedAt: "2024-01-04T12:15:00Z",
    likesCount: 52,
    commentsCount: 14,
    readTime: 8,
    isLiked: false,
  },
]

export const mockComments: Record<string, Comment[]> = {
  "1": [
    {
      id: "c1",
      content:
        "Great article! I'm particularly excited about the AI integration trends. Have you tried GitHub Copilot in your workflow?",
      author: {
        id: "2",
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "2024-01-20T12:30:00Z",
      likesCount: 3,
      isLiked: false,
    },
    {
      id: "c2",
      content:
        "The section on Web Assembly is spot on. We've been experimenting with WASM for our image processing pipeline and the performance gains are incredible.",
      author: {
        id: "3",
        name: "Emily Rodriguez",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "2024-01-20T14:15:00Z",
      likesCount: 5,
      isLiked: true,
    },
  ],
  "2": [
    {
      id: "c3",
      content:
        "This is exactly what I needed! The CSS Grid examples are super helpful. Do you have any resources for learning more about container queries?",
      author: {
        id: "4",
        name: "David Kim",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "2024-01-18T16:00:00Z",
      likesCount: 2,
      isLiked: false,
    },
  ],
  "3": [
    {
      id: "c4",
      content:
        "Excellent breakdown of React best practices. The component composition section really resonated with me. We've been refactoring our codebase following these principles.",
      author: {
        id: "1",
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "2024-01-16T11:45:00Z",
      likesCount: 7,
      isLiked: true,
    },
  ],
  "7": [
    {
      id: "c5",
      content: "AI tools have definitely changed my workflow. Copilot saves me hours every week on boilerplate code.",
      author: {
        id: "4",
        name: "David Kim",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "2024-01-08T17:20:00Z",
      likesCount: 4,
      isLiked: false,
    },
    {
      id: "c6",
      content:
        "Great point about maintaining fundamental skills. I worry that junior developers might become too dependent on AI without understanding the underlying concepts.",
      author: {
        id: "6",
        name: "Jessica Lee",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "2024-01-08T18:45:00Z",
      likesCount: 8,
      isLiked: true,
    },
  ],
  "8": [
    {
      id: "c7",
      content:
        "The ergonomics section is so important! I developed wrist pain from poor setup and had to take time off. Investing in proper equipment is worth every penny.",
      author: {
        id: "2",
        name: "Michael Chen",
        avatar: "/placeholder.svg?height=32&width=32",
      },
      createdAt: "2024-01-06T11:30:00Z",
      likesCount: 6,
      isLiked: false,
    },
  ],
}
