# DevMountain Tracker

Students of DevMountain, a Web Dev Full-Time Immersive Bootcamp, use The Q to notify mentors and instructors that a student is in need of help. All data regarding when the student entered The Q, how long it took them to receive help, and how long the mentor was helping them is stored. It also stores information regarding attendance and whether a student is on time, late, left early, or stayed the whole day. The Q is used to keep track of student progress throughout their time at DevMountain.
 
We took all that data from The Q to build a web application, emphasizing in data visualization, giving the instructors a more comprehensive view of how each student, cohort, and the overall bootcamp is doing.


### Tech:
AngularJS • HTML/CSS • NodeJS • Express • PostgreSQL • Jquery UI • Bootstrap • Moment.js • Sockets.io • D3 • DevMountain Passport.


![1](/README-img/1.png)

DevMountain Passport was used to create a login to limit the access of The DevMountain Tracker to Instructors and Lead Mentors. 

![2](/README-img/2.png)

The home view gives an snap-shot of the current status of the overall bootcamp.

Using Socket.io the DevMountain Tracker displays real-time red alerts when there is a long wait for a student to get help in one of the classrooms so other mentors or instructors can assist them.

Daily alerts are also displayed in the alert section which pull attendance information, large Q time percentages, and progress concerns of specific students. 

D3 is used to create the graphs displaying the status of The Q information everyday. The Total Q Time graph is drawn in real-time as the day goes on to show the most current status of the overall bootcamp. 

![3](/README-img/3.png)

The cohort view gives a more indepth look into each cohort. 

![4](/README-img/4.png)

A preferences side-menu gives you the ability to filter through the DevMountain locations and programs to choose the cohorts you'd like to see.

Cohort preferences can be removed or added at any time.

![5](/README-img/5.png)

These cohort preferences will display on the right side-menu. When a cohort is clicked on a second side-menu will slide out displaying all the students from that cohort. When applied the graphs and information on the cohort view will automatically update with the cohort specific information. 

The initial right side-menu will allow you to view all cohorts if you desire or reset the filters back to your desired preferences. You are able to filter through all the cohorts on this menu as well. 

![6](/README-img/6.png)

D3 is used to display the scatter graph of the student's progress to graduation and their project scores from their personal, group, and no-server projects. 

The Project Scores graph will update for the project selected across the top.

![7](/README-img/7.png)

D3 was also used to create the pie graphs. These graphs take large amount of cohort Q data and display the percentages of the highest three students in the areas of Highest Average Q Time Per Request, Most Requested Q Time, and Most Students Per Request.  

![8](/README-img/8.png)

Each D3 graph on the cohort view has a calendar which was created using Daterangepicker.js, JQuery, Moment.js, and Bootstrap.

The calendar will automatically display the information from the last seven days but once a new date is selected the graph will update with the information from that new date range. 

![9](/README-img/9.png)

The calendar on the right displays student absences. In the key below you are able to see how often each student is absent over the selected month. 

The line chart has a select menu for you to choose which graph you'd like displayed and then updates accordingly for that specific cohort and chosen date range.

The pie graph displays the information for the mentors and how long they average helping each student.

![10](/README-img/10.png)

At the bottom of each of the student Q time graphs there is an option to see all students. The student name is displayed and rather that the percentages you get the exact times and count of each student along with the student's name. 

![11](/README-img/11.png)

Each list can be opened individually or all at once. These views allow to you get an even more specific look at each student and their Q needs. 


