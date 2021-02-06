from git import Repo

PATH_OF_GIT_REPO = r'/home/pi/ritchykemp.github.io/.git/'  # make sure .git folder is properly configured
COMMIT_MESSAGE = 'comment from python script'

def git_push():
    try:
        repo = Repo(PATH_OF_GIT_REPO)
        repo.git.add(update=True)
        repo.index.commit(COMMIT_MESSAGE)
        origin = repo.remote(name='origin')
        origin.push()
    except:
        print('Some error occured while pushing the code')    

git_push()

###################################
#eigentlicher CODE
##########################

print("Hiermit teste ich ob es das ergebnis auch wirklich hochgelad$

datum = datatime.now()

print (datu
