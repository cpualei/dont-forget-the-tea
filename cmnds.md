
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
"reseed": "npx dotenv sequelize db:seed:undo:all && npx dotenv sequelize db:migrate:undo:all && npx dotenv sequelize db:migrate && npx dotenv sequelize db:seed:all",
"reset": "npx dotenv sequelize db:drop && npx dotenv sequelize db:create && npx dotenv sequelize db:migrate && npx dotenv sequelize db:seed:all",
"create": "npx dotenv sequelize db:create && npx dotenv sequelize db:migrate && npx dotenv sequelize db:seed:all"


# Sequelize Commands
CREATE USER boba_app WITH CREATEDB PASSWORD 'boba123';
CREATE DATABASE boba_development WITH OWNER boba_app;

(go into db file before generate)
npx sequelize-cli model:generate --name User --attributes firstName:string,lastName:string,username:string,profilePicURL:string,email:string,hashPassword:string
npx sequelize-cli model:generate --name Subtask --attributes content:string,taskId:integer,userId:integer
npx sequelize-cli model:generate --name Task --attributes content:string,userId:integer
npx sequelize-cli model:generate --name List --attributes title:string,userId:integer,includeWord:string,excludeWord:string,smart:boolean
npx sequelize-cli model:generate --name ListTask --attributes taskId:integer,listId:integer
npx dotenv sequelize-cli db:migrate

npx sequelize-cli seed:generate --name userSeeders
npx sequelize-cli seed:generate --name taskSeeders
npx sequelize-cli seed:generate --name subtaskSeeders
npx sequelize-cli seed:generate --name listSeeders
npx sequelize-cli seed:generate --name listTaskSeeders
npx dotenv sequelize-cli db:seed:all


# npm Packages
npm install sequelize
npm install sequelize-cli
npm install pg
npm install express-validator
npm install csurf


# Demo User Passwords
password: boba123
hash password: $2a$10$tmIIJV3Gfqe.hBQ4IGVgsOqh3me/hwREZEuYlcnMe6jJCu5LdhzAe
password: password123
hash password: $2a$10$BxK67eCPuwREeWxbvFkn.OAMr37IteK569/nPfOjhwAGV6AchoCMm


# Import Scripts
import script file into pug
delete btns should have an id which stores the id of whatever we want to delete
the divs that contain the lists should have unique ids with the list id (so you can select the div with that id)
the script file will query select all delete btns,
    loop through the delete btn array,
    add event listeners (click event listeners),
    e.prevent default,
    e.target.id.split (get id)
send a fetch request with a method of delete and path which includes id
delete route will get the id with req.params.id
findByPk in the database
then destroy it

if it successfully destroyed, json a msg of 'success' back to the front end
then on the front end, translate the msg again with json,
check if you have msg of success,
if successful, find the div where the list is contained and remove the div



config vars
DATABASE_URL postgres://wunulsfdhjyxcw:c5a86a094eda105d1057f54b65e5dfbc8a4a043a528b9c1a2bdc9c2d33b568a2@ec2-44-194-4-127.compute-1.amazonaws.com:5432/d9t34q227e6k6e

PGSSLMODE no-verify

SESSION_SECRET superSecret123
