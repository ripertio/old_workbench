from git import Repo
import datetime
from datetime import datetime

PATH_OF_GIT_REPO = r'/home/pi/ritchykemp.github.io/.git/'
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



###################################
#eigentlicher CODE
##########################

print("Hiermit teste ich ob es das ergebnis auch wirklich hochgelad")
git_pull()

datum = datetime.now()

file = open('Zeitstempelalarm.txt', 'a')
file.write(datum.strftime('%y-%m-%d %H:%M:%S' '\n'))
file.close()

print (datum)

print("Push befehl durchführen")
git_push()

print ("DONE")
