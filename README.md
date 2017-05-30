# DevMountain Tracker

Students of DevMountain, a Web Dev Full-Time Immersive Bootcamp, use The Q to notify mentors and instructors that a student is in need of help. All data regarding when the student entered The Q, how long it took them to receive help, and how long the mentor was helping them is stored. It also stores information regarding attendance and whether a student is on time, late, left early, or stayed the whole day. The Q is used to keep track of student progress throughout their time at DevMountain.
 
We used the data from The Q to build a web application with data visualization to give the instructors a more comprehensive view of how each student, cohort, and the overall bootcamp is progressing.

Please note that in order to keep sensitive information anonymous; names have been changed, blurred out or listed as just 'student'. In the actual application, real student names are displayed.


### Tech:
AngularJS • HTML/CSS • NodeJS • Express • PostgreSQL • Jquery UI • Bootstrap • Moment.js • Sockets.io • D3 • DevMountain Passport


![1](/README-img/1.png)

DevMountain Passport was used to create a login to limit the access of The DevMountain Tracker to Instructors and Lead Mentors. 

![2](/README-img/2.png)

The home view gives a snapshot of the current overall status for the day.

Using Socket.io the DevMountain Tracker displays real-time red alerts in an alert feed when a student has been waiting in The Q to get help for more than 10 minutes. This aids mentors and instructors to know who needs immediate assistance.

Daily alerts are also displayed in the alert feed which pulls attendance information, large Q time percentages, and progress concerns of specific students. 

D3.js is used to display The Q information graphs. These graphs are drawn in real-time as the day goes on to show the current overall status of The Q. 


![3](/README-img/3.png)


The cohort view gives a more indepth look into each individual cohort. 


![4](/README-img/4.png)


A preferences side-menu gives a user the ability to filter through the DevMountain locations and programs to choose the cohorts they would like to see on a regular basis.

Cohort preferences can be removed or added at any time and is updated throughout the site in real-time.


![5](/README-img/5.png)


These cohort preferences display on the right side-menu. When a cohort is selected, a second side-menu slides out to display all the students from that cohort. When applied, the graphs and information on the cohort view will automatically update with the cohort's specific information. 

The initial right side-menu allows the user to view all registered cohorts, filter through those cohorts and reset back to the desired preferences.


![6](/README-img/6.png)


D3.js is used to display the scatter graph of the student's progress to graduation and their project scores from their personal, group, and no-server projects. 

The Project Scores graph updates according to the project selected from the top menu buttons.


![7](/README-img/7.png)


D3.js is used to create the pie graphs. These graphs take large amounts of cohort Q data and display the percentages of the highest three students in the areas of Highest Average Q Time Per Request, Most Requested Q Time, and Most Students Per Request.  


![8](/README-img/8.png)


Each D3.js graph on the cohort view has a calendar which was created using Daterangepicker.js, JQuery, Moment.js, and Bootstrap.

These calendars are preset to display information from the last seven days on login. When a new date is selected for a certain graph, that graph will update with new information from the selected date range. 


![9](/README-img/9.png)


The calendar on the right displays student absences. In the key below, a user is able to see how often each student has been absent since the start of their cohort. 

The line chart has a select menu with the option to choose what information will be displayed. It updates in real-time for the currently selected cohort and chosen date range.

The pie graph displays the information for the cohort's mentors and how long they average in helping a student.


![10](/README-img/10.png)


At the bottom of each of the student Q time graphs, there is an option to see all students. Each student and their data are displayed to give the user information about specific students.


![11](/README-img/11.png)


Each list can be opened individually or all at once. These views allow to you get an even more specific look at each student and their Q needs. 


