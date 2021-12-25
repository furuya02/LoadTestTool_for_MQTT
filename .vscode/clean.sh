for DIR in  . src dst .vscode
do
    find ${DIR} -name dist | xargs rm -rf
done
