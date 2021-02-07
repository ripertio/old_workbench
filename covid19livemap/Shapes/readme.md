This is a project to install a automatic Covid19 - Livemap of Austria (Bezirke & Bundesländer)
The python script is mainly based on numpy geopandas and folium (with all dependencies)

Aim is to auto run the python script daily and push the new map containing html file to my git-repo 
The script should be run on my respberrypi so it is independent of my pc usage


Fist things first:
If you want to access your pi via ssh I found this tutorial easy and helpful
https://42bots.com/tutorials/access-raspberry-pi-terminal-and-desktop-remotely-with-ssh-and-vnc/


Second stop would be to run your script on the PI:
I had several issues installing geopandas on Raspberrypi OS (especially installing  proj, pyproj, geopandas). Since on my Ubuntu 20.10 these moduls work perfectly fine --> next try will be to install ubuntu 20.04 Server on the respberry pi 

https://ubuntu.com/tutorials/how-to-install-ubuntu-on-your-raspberry-pi#1-overview


If you ran your pi on respberrypi OS I found this tutorlal very helpful to install geopandas 
https://wlog.viltstigen.se/articles/2020/06/19/maps-with-geopandas-and-geoplot/

check if your proj-bin version is really newer then 6.x.x. since otherwise it will not work in python3!!!

After your script runs without errors do the following:

Add to your code the following functions:


from git import Repo
import datetime
from datetime import datetime

PATH_OF_GIT_REPO = r'YOUR local GIT REPO path .git'
COMMIT_MESSAGE = 'comment from python script'

def git_pull():
    repo = Repo(PATH_OF_GIT_REPO)
    repo.git.pull()

def git_push():
    try:
        repo = Repo(PATH_OF_GIT_REPO)
        repo.git.add(update=True)
        repo.index.commit(COMMIT_MESSAGE)
        origin = repo.remote(name='origin')
        origin.push()
    except:
        print('Some error occured while pushing the code')    

ath the beginning your python file run git_pull 
and an the end git_push 


now; if you run your python script in your git path it should automatically pull and push all changes
If id does not work check your git settings (see if your repo origin is based on an ssh key) and if your usre name is set in  config --global .


To run the scrpit automatically I use cronetab
with the command 

sudo crontab -e 

you can define when you want to run what task automatically 

tutorial: https://geekflare.com/de/crontab-linux-with-real-time-examples-and-tools/

