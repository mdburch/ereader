#! /usr/bin/env python
import sys

rf = open("Alice_mod.txt")
wf = open("Alice_mod2.txt","w")

text = rf.read()
text_new = text.replace("\t", " ")
text = text_new.replace("<br><br>", "<cr>")
text_new = text.replace("<br>", " ")
text = text_new.replace("<cr>", "<br><br>")
wf.write(text)