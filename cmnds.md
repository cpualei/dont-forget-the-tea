
# Instructions
1. Use cmnds.md file
2. Use previous projects for auth and database setup
3. Set up database
4. Set up user auth
5. Set up demo user button (with hidden form)
6. Work on features (together or separately)
7. For merge conflicts:
    - Pause
    - Get together
    - Figure out conflict
8. If you split up, work on different sections to prevent merge conflicts.

# Github Workflow
Make new branch
Work on new branch
    git add .
    git commit -m ""
    git push
Make a pull request
Someone will approve pull request, LOOK AT CODE, then merge to main
Check out back to main, git pull
Update your working branch by switching to that branch and using 'git merge main'

# Git Stash
1.	Git stash to pick up all the changes
2.	Git checkout the current local branch
3.	Git stash apply to move all the changes to current local branch
4.	Git stash drop – delete all the changes

# Sequelize Scripts
"reseed": "npx dotenv sequelize db:seed:undo:all && npx dotenv sequelize db:migrate:undo && npx dotenv sequelize db:migrate && npx dotenv sequelize db:seed:all",
"reset": "npx dotenv sequelize db:drop && npx dotenv sequelize db:create && npx dotenv sequelize db:migrate && npx dotenv sequelize db:seed:all",
"create": "npx dotenv sequelize db:create && npx dotenv sequelize db:migrate && npx dotenv sequelize db:seed:all"


# Sequelize Commands
CREATE USER boba_app WITH CREATEDB PASSWORD 'boba123';
CREATE DATABASE boba_development WITH OWNER boba_app;


# npm Packages
npm install sequelize
npm install sequelize-cli
npm install pg
