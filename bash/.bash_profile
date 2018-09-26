if [ -f ~/.profile ]; then
   source ~/.profile
fi

export HISTCONTROL=ignoredups:erasedups  # no duplicate entries
export HISTSIZE=100000                   # many commands in ongoing session memory
export HISTFILESIZE=100000               # many lines in .bash_history
shopt -s histappend                      # append to history, don't overwrite it
