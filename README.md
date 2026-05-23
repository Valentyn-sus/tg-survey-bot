# Telegram Survey & Questionnaire Bot

A lightweight, asynchronous Telegram bot built with the `node-telegram-bot-api` library designed to conduct step-by-step multi-user surveys and record feedback.

##  Key Features
- **Session-Based State Management:** Uses an in-memory user-state map to safely handle continuous conversation flows and map answers to specific active users.
- **Dynamic File Persistence:** Automatically creates, reads, and updates an answers storage file (`answers.json`) ensuring persistent records without database overhead.
- **Interactive UI:** Leverages custom reply keyboards with automatic layout adjustments to guide users through multiple-choice selections.

##  Tech Stack
- **Backend:** Node.js, JavaScript (ES6+)
- **API & Libraries:** node-telegram-bot-api, Native File System (`fs`)
