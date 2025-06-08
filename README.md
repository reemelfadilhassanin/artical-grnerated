# 📝 AI Article Generator

## Project Overview

**AI Article Generator** is a simple, modular content generation web app built with **LangChain.js** and  **LangChain Expression Language (LCEL)** . It allows users to input a topic and receive a fully structured article, including:

* Headline
* Introduction
* Body
* Conclusion

The app combines a **React frontend** and a **Node.js + LangChain backend** using LCEL's `.pipe()` syntax to create a smooth content generation experience.

---

## How It Works

### Flow Summary

1. **User Input** : Enter a topic in the web UI.
2. **Processing (Backend)** :

* LCEL pipelines generate each article section in order.

1. **Output** : Display the complete article in the browser.
