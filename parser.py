#! /usr/bin/env python
rf = open("Alice_formatted.txt")
wf = open("Alice.xml","w")

i = 0
page = 0
chapter = 1
contents = {}

def close():
	wf.write("\n]]>")
	wf.write('\n</page>')
	#wf.write('\n</chapter>')
	wf.write('\n</book>\n<tableOfContents>')
	
	for key in contents:
		wf.write('\n<chapter num=\"' + str(key) + '\">' + str(contents[key]) + '</chapter>')

	wf.write('\n</tableOfContents>\n</Alice>')
	rf.close()
	wf.close()
	quit()

wf.write('<?xml version="1.0" encoding="ISO-8859-1"?>\n')
wf.write('<Alice>\n')
wf.write('<book>')
while 1:
	while i < 3200:
		char = rf.read(1)
		
		#if we've reach a line return or chapter break
		if char == "<":
			char += rf.read(1)
			if char == "<c":
				rf.read(1)
				if page != 0:
					wf.write("\n]]>")
					wf.write('\n</page>')
					#wf.write('\n</chapter>')
					page += 1
					chapter += 1

				#wf.write('\n<chapter num=\"' + str(chapter) + '\">')
				wf.write('\n<page num=\"' + str(page) + '\">\n')
				wf.write("<![CDATA[\n")
				
				contents[chapter] = page
				i = 0
			else:
				char += rf.read(7)
				wf.write(char)
				i += 100
		
		#end of file reached
		elif char == "": close()
		
		#otherwise, proceed 
		else: 
			wf.write(char)
			i += 1
	
	#when we break, look for the next paragraph break
	char = rf.read(1)
	while char != "<":
		wf.write(char)
		char = rf.read(1)

	#if this is the end of a chapter
	if rf.read(1) == "c":
		rf.read(1)
		wf.write("\n]]>")
		wf.write('\n</page>')
		#wf.write('\n</chapter>')
		page += 1
		chapter += 1
				
		#wf.write('\n<chapter num=\"' + str(chapter) + '\">')
		wf.write('\n<page num=\"' + str(page) + '\">\n')
		wf.write("<![CDATA[\n")
				
		contents[chapter] = page
		i = 0
	else:
		#end of line, eat the characters
		rf.read(6)
		
		#we've found where we want to put the next page
		wf.write("\n]]>")
		wf.write('\n</page>')
		page += 1
		wf.write('\n<page num=\"' + str(page) + '\">\n')
		wf.write("<![CDATA[\n")
		i = 0
