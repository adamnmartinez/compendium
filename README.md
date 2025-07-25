# [Compendium](https://compendiumapp.netlify.app/), A notes app for readers, writers, and students.

![compendiumss](https://github.com/adamnmartinez/compendium/assets/140022079/dc6d6a24-3726-4055-a93a-418abb88732d)

Compendium is a note-taking app made to help organize ideas and annotations surrounding books, articles, and other literary works. Take comprehensive notes for essays, writing projects, personal study, and more. This application was written in Typescript with React, and is hosted through Netlify. The book search feature is powered by Google's Books API. The primary aim of this project was to create a useful application with functionality for posts, deletion, and modification of entries that also incorporated a REST API. This project was the first one I designed and completed that made use of an API. You can visit the live site [here](https://compendiumapp.netlify.app/).

## User Guide
### Getting Started
To get started, you'll need to create an account on the landing page. Create a strong password with a special character, numbers, and a mix of uppercase and lowercase letters to proceed.

Once you've made an account, the first thing you'll see is your library!

<img width="1874" height="891" alt="image" src="https://github.com/user-attachments/assets/04c05722-8d4a-4ea0-b1dc-ed106e49dff7" />

### Adding a Book
To start using the app's features, click on "New Entry" to add your first book!

From here, you can either search for a book...

<img width="1728" height="604" alt="image" src="https://github.com/user-attachments/assets/495baad9-49ae-4456-8f10-a569f54b4dbb" />

Or manually fill in some information to create your own entry!

<img width="1727" height="694" alt="image" src="https://github.com/user-attachments/assets/0361be64-b71c-40dc-b8be-ac6fba3f218c" />

While the title is the only required field for manual entries, more information will be helpful when using the built-in citation feature (more on that later).
Additionally, while the search feature can't currently find research papers or journal articles, you can still keep track of those kinds of literature through manual entry.

### The Library Page
Once you have a book entry on your page, you'll be able to edit the entry data (regardless of whether it was added manually or automatically) and delete the literature when it is no longer needed. You can also use the search bar to find entries in your library by searching for titles or author names!

### The Notes Page
The Notes Page is designed to help you engage with the texts in your library. From here you can take digital notes about general thoughts or specific passages, allowing your ideas to be preserved in a permanent and organized database. Moreover, you'll have the option to use the citation generator to automatically create refrences to use in research papers or essays.

<img width="1666" height="492" alt="image" src="https://github.com/user-attachments/assets/e622612b-3008-45da-9b17-90109cc38b46" />

To use the citation generator, simply click "Cite This Source" and select which citation style you want to use! You may have additional options depending on what style you use, as different styles organize and represent data in unique ways.

<img width="1666" height="363" alt="image" src="https://github.com/user-attachments/assets/13055a03-068a-4642-a615-7bb8486d590e" />
<img width="1658" height="303" alt="image" src="https://github.com/user-attachments/assets/51f55714-7be9-4f5c-826c-1383875018a0" />


## Developer Guide
First, you'll need to make sure the Node Package Manager (npm) is installed on your machine.

To run compendium locally, start by cloning the repository onto your machine.
```
git clone https://github.com/adamnmartinez/compendium
```
Then, go into the directory and install the required dependencies.
```
cd compendium
npm install
```
You can start running the web application by using `npm run dev` while in the root directory. This will spin up the web server and send you a link to connect to it using your browser.
