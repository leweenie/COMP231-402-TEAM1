# How to Run
- Install the application with `npm install` from the root folder
- Run the application with `npm run dev` from the root folder
- May need to delete existing node_modules folders in client and server folders if you've got an older, existing version of the repo (including branches)

# COMP231-402-TEAM1

## Iteration 1: Tasks

### As a job poster/superhero/administrator, I want to access my user profile [Dashboard -> User Profile]

- Create sample user profile in database / Wilson
- Writing requests from app to db for profile info / Wilson
- Code UI element linking to profile / Wilson
- Code UI elements displaying user profile / Wilson
- Write and execute test cases for user profile access / Wilson

### As a job poster, I want to make a job post so that a superhero can solve my problem [Job Post] 

- Code UI elements of job creation form / Catarina
- Writing requests posting new job to database / Catarina
- Code UI element launching create job post view / Catarina
- Write basic validation for fields of form / Gail
- Write and execute test cases for job posting / Catarina

### As a job poster, I want to easily view all applicants for my specific job. [Job Post] 

- Code UI elements using post information / Natalie 
- Create an API request to fetch the db information / Taryn 
- Code links of each applicant to their profile / Natalie
- Create sample job in db / Taryn 
- Create sample applicant users in db / Taryn 
- Write and execute test cases for viewing applicants / Taryn 

### As a job poster, I want to be able to accept any of the pending applicants for my specific job. [Job Post] 

- Code UI element to accept or reject an applicant / Natalie
- Write query to update job applicant (superhero) information  / Gail
- Write query to update job post status / Gail
- Write and execute test cases for accepting applicants / Gail


### As a job poster/superhero, I want to see a list of all my active jobs and be able to track their progress.[Dashboard ] 

- Code display UI to show active jobs as a list, placed on the dashboard / Natalie
- Write DB query to retrieve active jobs / Catarina
- Code each item in the list to link to their job post details / Natalie
- Write and execute test cases for tracking job progress / Catarina


### As a superhero, I want to be able to apply to a job that is posted by someone requiring assistance. [Job Post] 

- Code UI elements to apply to job / Mohamed
- Write API request to submit an application / Catarina
- Code UI to update applied Job Post status / Mohamed
- Write and execute test cases for job application process / Mohamed


### As a job poster/superhero/administrator, I want to go to the Job Board from the dashboard to view all jobs. [Dashboard -> Job Board, Fig. 37 -> Fig. 45] 

- Add link to direct user to job board (part of Nav bar UI)  / Sam
- Create minimum 3 sample job posts in db  / Sam
- Write and execute test cases for job board navigation / Sam


### As a job poster/superhero/administrator, I can access the job board to see all the listings [Job Board - Fig. 45]

- Code UI elements to display all jobs dynamically on the Job Board  / Fred
- Code API request to fetch job listings, sorted by date and active / Fred
- Pre-populate  the database with 3 sample job posts / Fred
- Write and execute test cases for displaying listings in job board / Fred

### System story: Initial backend server setup
- Set up database schema and tables.  / Gail
- Configure database connection in backend. / Gail
- Create initial backend API endpoints. / Gail
- Test database connectivity and query performance. / Gail
