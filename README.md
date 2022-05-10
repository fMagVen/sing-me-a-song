# Sing-me-a-song 🎙️
## Community voting based music recommendation

### :computer: Tech used
<p>
	<img src="https://img.shields.io/badge/shell_script-%23121011.svg?style=for-the-badge&logo=gnu-bash&logoColor=white"/>
	<img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white"/>
	<img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/>
	<img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"/>
	<img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white"/>
	<img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
	<img src="https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white" />
	<img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" />
	<img src="https://img.shields.io/badge/-cypress-%23E5E5E5?style=for-the-badge&logo=cypress&logoColor=058a5e" />
	<img src="https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white" />
</p>

## Overview
An app that allows you to add a youtube link and a title to a database. You can upvote or downvote all the added entries, get the top ranked ones or get a random one, with 70% chance of it being good rated.

## :hammer_and_wrench: Installation
### Make sure you have the following tools installed before you begin:
<p>
	<a href="https://git-scm.com/"><img src="https://img.shields.io/badge/GIT-E44C30?style=for-the-badge&logo=git&logoColor=white"/></a>
	<a href="https://www.npmjs.com/package/npm"><img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white"/></a>
	<a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/></a>
	<a href="https://www.postgresql.org/download/"><img src="https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white"/></a>
</p>
<p>Not needed but recommended: <a href="https://code.visualstudio.com/">VSCode</a></p>


Use a terminal interface such as bash or zsh, and enter the following:
```bash
#download
gh repo clone fMagVen/sing-me-a-song

#access the folder you downloaded it to
cd sing-me-a-song
```
On the front-end folder, create a .env file following the .env.example file, create the key with the address the back-end api will be hosted on. The default is port 5000 of your localhost.
```
REACT_APP_API_BASE_URL=http://localhost:5000
```
On the back-end folder, do the same, follow the .env.example file, fill the first key with the connection string to the development database and the second with the environment string, for the development environment use `dev`. Default values are:

```
DATABASE_URL=postgres://postgres:123456@localhost:5432/singmeasong
NODE_ENV=dev
```
```bash
#migrate the database tables running

npm run migratedev

#finally, install dependencies with

npm i
```

## 🧰 Testing
### This app comes with automated tests to check if everything is working.

First, create a .env.test file, just like regular .env, change the database connection string to target a test database, and the second key to `test`

```
DATABASE_URL=postgres://postgres:123456@localhost:5432/domeatest
NODE_ENV=test
```

 Use a terminal interface such as bash or zsh, and enter the following:

 ```bash
 #access the server folder, if you're not there already
 cd back-end

#migrate the test database
npm run migratetest
 ```
Once that's done, you can run end to end (front and back) tests

```bash
#access the server folder, if you're not there already
cd back-end

#run the server on e2e test mode
npm run test:e2e

#access the react app folder
cd front-end

#start in development mode
npm run start

#start cypress
npm run cypress
```

You can choose any test for cypress to run, you can also run server-side integration and unit tests:

```bash
#access the server folder
cd back-end

#run the automated integration and unit tests
npm run test:integunit
```

The latter may take a while.

## :gear:Running
```bash
#access the server folder
cd back-end

#you can run the server in development mode with
npm run dev

#you can run the react app in development mode with
npm run start
```

## 🖱️Usage - front end

On the homepage, you can add a song by typing in it's name and youtube link and clicking on the red button to the right side. It should add new and 10 last songs should appear by order of entry. Songs with a score lower than -5 are deleted.

On the top page, songs should appear by upvote ranking, up to 20

On the random page, you should get a random song. 70% change you'll get a song with a score above 10, 30% chance you'll get a song with a score between -5 and 10. If there are only songs with a score between -5 and 10 or above 10, you'll get any of them randomly.

## :scroll:Documentation - back end API

### All requests are HTTP based

#### ```POST /recommendations```

To add new song and recommend it, send request with the body (in JSON):

{

	name: string, mandatory
	youtubeLink: string, must be a link from youtube

}

#### ```POST /recommendations/:id/upvote```

Add a unit to the song score, require it's id parameter, no body required

#### ```POST /recommendations/:id/downvote```

Remove a unit from the song score, require it's id parameter, no body required, songs which score goes bellow -5 get deleted

#### ```GET /recommendations```

Get 10 last recommended songs. Response has format (in JSON):

```

[

	{

		id: song id in the database,
		name: song name in the database,
		youtubeLink: link to song in youtube,
		score: total score the song has

	}

]

```

#### ```GET /recommendations/:id```

Get specific song by id parameter. Response will have body in format like an object from an array like above. (Only the object, not inside an array)

#### ```GET /recommendations/random```

Get a random song, following the percentage rules. Response will have the same object body format.

#### ```GET /recommendations/top/:amount```

Get the ```amount``` top rated songs, front app default is 20. Response will have same body format as ```/recommendations``` route.

### :man_technologist: Tests implemented by:

<a href="https://github.com/fMagVen"><img  style="border-radius: 50%;"  src="https://avatars.githubusercontent.com/u/78576546?v=4"  width="100px;"  alt="Felipe Ventura"/></a>

[![Gmail Badge](https://img.shields.io/badge/-fmagven93@gmail.com-c14438?style=flat&logo=Gmail&logoColor=white&link=mailto:fmagven93@gmail.com)](mailto:fmagven93@gmail.com)

[![Linkedin Badge](https://img.shields.io/badge/-Felipe-Ventura?style=flat&logo=Linkedin&logoColor=white&color=blue&link=https://www.linkedin.com/in/fmagven/)](https://www.linkedin.com/in/fmagven/)

Contact me anytime!