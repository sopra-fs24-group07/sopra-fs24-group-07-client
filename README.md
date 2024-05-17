# ProductiviTeam

ProductiviTeam is a online platform which helps students to organize
themselves. You can create teams and invite you peers. In sessions you can work
in a dedicated time frame on your previously defined tasks.

The goal of this application is to increase the productivity of small teams. As
students we want to help other students to coordinate themselves in teams when
working in group projects.

## Functionality

In order to help teams to coordinate, plan and execute a project, we have
implemented a task system that follows the Kanban methodology. Team members can
mark tasks which they want to do in the next group session and comment on
those.

When planning a session, the members can set a time goal on how long they want
to work in that session. During the session a voice chat is started with
separate breakout rooms (separate voice channels) for each task wehere the
designated team members of that task can work without disturbance. Teams can
track their previous session and see how long they have worked on each.

## Technologies

- **TODO**
- React
- REST Interface
- Google Cloud Project
  - App Engine
- [Agora.io](https://www.agora.io/en/) Voicechat
- [Pusher](https://pusher.com/)
- [Mailjet](https://www.mailjet.com/)
- [OpenAI ChatGPT
  API](https://openai.com/index/introducing-chatgpt-and-whisper-apis/)

## Launch and Development

**Note**: More details can be found in the documentation on Confluence (Wiki ->
Backend). If you start contributing, you will get invited to the Confluence
project.

### 1. Clone Project

- `git clone <url>`

### 2. Install Pre-Commit Hooks

- Download [pre-commit](https://pre-commit.com/)
- Execute the following commands in the root of the project

```bash
pre-commit --version  # verify that pre-commit is installed correctly
pre-commit install    # install the hooks
```

Every time you make a commit, the pre-commit hooks will run through to ensure
the formatting (possibly among other future things) is correct. If not it will
reformat and you can add formatted files and commit again. This ensures a
uniform code formatting accross all contributors.

### 3. Install Prerequisites

For your local development environment, you will need Node.js.

Please use the exact version **v20.11.0** which comes with the npm package
manager. You can download it
[here](https://nodejs.org/download/release/v20.11.0/).\\ If you are confused
about which download to choose, feel free to use these direct links:

- **MacOS:**
  [node-v20.11.0.pkg](https://nodejs.org/download/release/v20.11.0/node-v20.11.0.pkg)
- **Windows 32-bit:**
  [node-v20.11.0-x86.msi](https://nodejs.org/download/release/v20.11.0/node-v20.11.0-x86.msi)
- **Windows 64-bit:**
  [node-v20.11.0-x64.msi](https://nodejs.org/download/release/v20.11.0/node-v20.11.0-x64.msi)
- **Linux:**
  [node-v20.11.0.tar.xz](https://nodejs.org/dist/v20.11.0/node-v20.11.0.tar.xz)
  (use this [installation
  guide](https://medium.com/@tgmarinho/how-to-install-node-js-via-binary-archive-on-linux-ab9bbe1dd0c2)
  if you are new to Linux)

If you happen to have a package manager the following commands can be used:

- **Homebrew:** `brew install node@20.11.0`
- **Chocolatey:** `choco install nodejs-lts --version=20.11.0`

After the installation, update the npm package manager to **10.4.0** by running
`npm install -g npm@10.4.0`\\ You can ensure the correct version of node and npm
by running `node -v` and `npm --version`, which should give you **v20.11.0**
and **10.4.0** respectively.\\ Before you start your application for the first
time, run this command to install all other dependencies, including React:

`npm install`

### Running Development Mode

Next, you can start the app with:

`npm run dev`

Now you can open [http://localhost:3000](http://localhost:3000) to view it in
the browser.

Notice that the page will reload if you make any edits. You will also see any
lint errors in the console (use a Chrome-based browser).

The client will send HTTP requests to the server which can be found
[here](https://github.com/sopra-fs24-group07/sopra-fs24-group-07-server). In
order for these requests to work, you need to install and start the server as
well.

### Build

Finally, `npm run build` builds the app for production to the `build`
folder.

It correctly bundles React in production mode and optimizes the build for the
best performance: The build is minified, and the filenames include hashes. See
the section about
[deployment](https://facebook.github.io/create-react-app/docs/deployment) for
more information.

### Contributing

**Branches**

- The `main` branch is protected and can only be modified via pull requst
- The `dev` branch will be used for development, and merged only into `main` if
  a milestone has been reached

**Pull Requets**

- The checkboxes serve as a reminder what should be done before a pull request

## Main User Flows

### Creating Account and Teams

For the user to use our platform, they first must create an account or
login. After login they have are redirected to the "Team Overview" page. Here
they can see all their teams of which they are part of (or none if they are
not, yet, part of one). Additionally, they have the possiblity to create new
teams.

The user can click on a team card to visit the "Team Dashboard" of that
team. This is a separate page dedicated to the team's tasks, sessions, and
settings. The user might first want to invite new team members, which they can
do by clicking on the person icon to view all the current members and invite
new users. This can be done by sending an email to the user that should be
invited or sending the invitation link manually.

### Collaborating with Other Users

The other user can click on the invitation link which they recieve. Doing that
they are redirected to the login or register page first, if they are not yet
logged in or registered.

Once logged in they can see their new team and also visit the Team
Dashboard. They are now a full team member, meaning they have the same
permissions and can do the same, as the user that created the team.

Once tasks have been created, users can drag them into the "Next Session"
column of the Kanban board. These are the tasks marked to be working on in the
next group session. Sessions can be started by setting a time goal, i.e., how
many hours and minutes the team wants to work on, and pressing the "Start Group
Session" button.

During a session, the team members can use a voice chat. In order to talk to
the other team members, they must be in the saim "breakout room", which is a
separate voice chat channel. The "main" channel is the voice chat not
designated to a task in the task list. Users can coordinate there which user
should do what. Each task has a separate breakout room (separate voice chat
channel), which the users can use to work concentrated on that task, without
beeing distracted by the other team member's chatter. When they decide that
they have finished this task, they can check the checkbox next to the task to
mark it as done.

When the time of the sesssion is finished, the timebar dissapears, but the team
members are able to further collaborate in the session. All team members are
redirected to the Team Dashboard with the Kanban board view. They note that the
tasks which they have marked as done during the session, are now in the "Done"
column of the board as well.

## High-Level Components

**TODO**

## Roadmap

**Session Statistics**

- More detailed session statistics
- Track how many tasks were completed during a session
- Redo the "Session History" popup to show more information about each session

**Security**

- Add secure login client components

## Authors & Acknowledgement

- Derboven, Timon ([@Monti934](https://github.com/Monti934))
- Furrer, Basil ([@B1s9l](https://github.com/b1s9l))
- Greuter, Sven ([@5v3nn](https://github.com/5v3nn))
- Karatasli, Alihan ([@Alihan26](https://github.com/Alihan26))

Based on
[HASEL-UZH/sopra-fs24-template-client](https://github.com/HASEL-UZH/sopra-fs24-template-client)

## License

See [LICENSE](./LICENSE)
