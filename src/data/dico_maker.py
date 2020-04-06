# -*-coding:utf8 -*

f = open("kanji_list.txt", "r")
line = f.readline()
kanji = open("kanaDictionary.js", "w")
kanji.write("export const kanaDictionary = {\n")
trad = open("traductionDictionary.js", "w")
trad.write("export const traductionDictionary = {\n")
counter = 0
kanji_content = []
trad_content = []
separator = ", "
while line :
	keys = line.split()
	print(kanji_content) 
	if len(keys) == 1:
		counter += 1

		if counter > 1:
			kanji.write(separator.join(kanji_content))
			trad.write(separator.join(trad_content))
			kanji_content = []
			trad_content = []
			kanji.write("} } },\n")
			trad.write("} } },\n") 

		kanji.write("\t'" + keys[0] + "': {\n")
		trad.write("\t'" + keys[0] + "': {\n")
		kanji.write("\t\t'k_groupe0': { characters: {")
		trad.write("\t\t'trad_groupe0': { characters: {")

	if len(keys) >= 3:
		kanji_array = "'" + keys[1] + "': ['" + keys[0] + "'] "
		trad_array = "'" + keys[-1] + "': ['" + keys[0] + "'] "
		kanji_content.append(kanji_array)
		trad_content.append(trad_array)
	
		
	line = f.readline()

kanji.write(separator.join(kanji_content))
trad.write(separator.join(trad_content))
kanji.write("} } }\n };")
trad.write("} } }\n };")
kanji.close()
trad.close()
