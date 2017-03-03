#!/usr/bin/env python
# -*- coding: UTF-8 -*-
from pysvg.filter import *
from pysvg.gradient import *
from pysvg.linking import *
from pysvg.script import *
from pysvg.shape import *
from pysvg.structure import *
from pysvg.style import *
import pysvg.text
from pysvg.builders import *
import math
import cgitb
import cgi

hours = ["VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII"]

def draw_sundial(latitude, longitude, scale, city_name = ""):
	width = scale;
	height = scale;
	circle_distance = 20

	svg_document = svg()
	shape_builder = ShapeBuilder()
	svg_defs = defs()

	main_circle = shape_builder.createCircle(width / 2.0, height / 2.0, width / 2.0 - circle_distance, strokewidth = 3, stroke = "black")
	secondary_circle = shape_builder.createCircle(width / 2.0, height / 2.0, width / 2.0 - 2 * circle_distance, strokewidth = 3, stroke = "gray")
	outside_circle = shape_builder.createCircle(width / 2.0, height / 2.0, width / 2.0, strokewidth = 3, stroke = "black")

	gnomon_base_x = width / 2.0
	gnomon_base_y = height/ 2.0
	gnomon_base_width = 0.2 * scale
	line_length = width / 2.0 - circle_distance
	svg_document.addElement(shape_builder.createLine(gnomon_base_x, gnomon_base_y, gnomon_base_x, gnomon_base_y - gnomon_base_width, strokewidth=2, stroke="rgb(201, 54, 54)"))

	clip_path = clipPath(id="pathRect")
	clip_path.addElement(main_circle)
	svg_defs.addElement(clip_path)
	svg_document.addElement(svg_defs)

	offset = int(longitude / 15) / 2.0 - longitude / 15.0

    #draw lines and numbers
	for time in range(6 * 4, 18 * 4 - 3):
		hour_angle = math.radians(time / 4.0 * 15) - offset
		length = 0;
		color = ""
		start_length = 0;

		if time % 4 == 0:
			length = line_length
			color = "rgb(57, 112, 233)"
			start_length = 0
		elif time % 4 == 2:
			length = circle_distance
			color = "rgb(89, 135, 237)"
			start_length = width / 2.0 - 2 * circle_distance
		else:
			length = circle_distance
			color = "rgb(144, 174, 238)"
			start_length = width / 2.0 - 2 * circle_distance

		angle = math.atan(math.tan(hour_angle) * math.sin(latitude))
		line_start_x = gnomon_base_x + math.sin(angle) * start_length
		line_start_y = gnomon_base_y - math.cos(angle) * start_length
		line_end_x = line_start_x + math.sin(angle) * length
		line_end_y = line_start_y - math.cos(angle) * length

		line = shape_builder.createLine(line_start_x, line_start_y, line_end_x, line_end_y, strokewidth=2, stroke=color)
		line.set_clip_path("url(#%s)" % "pathRect")
		svg_document.addElement(line)

		if time % 4 == 0:
			cos_angle = math.cos(angle)
			sin_angle = math.sin(angle)
			text_x = line_end_x + math.sin(angle) * 5;
			text_y = line_end_y - math.cos(angle) * 5;
			text = hours[(int)(time / 4) - 6]

			deg_angle = str(int(math.degrees(angle)))
			text = pysvg.text.text(text, x = text_x, y = text_y, fill = "rgb(26, 56, 88)")
			text.set_text_anchor("middle")
			text.set_transform("rotate("+ deg_angle +", " + str(text_x) + "," + str(text_y) + ")")
			#text.set_rotate(math.degrees(angle))
			svg_document.addElement(text)

    #draw info
	city_name_text = pysvg.text.text(city_name, x = width / 2.0, y = height - 0.15 * scale)
	city_name_text.set_text_anchor("middle")

	svg_document.addElement(outside_circle)
	svg_document.addElement(main_circle)
	svg_document.addElement(secondary_circle)

    #city_name_text.set_text_size("1em")
	svg_document.addElement(city_name_text)

	print svg_document.getXML()

if __name__ == '__main__':
	cgitb.enable()
	print "Content-type: image/svg+xml\n"
	#print "Content-type: text/html\n"
#	print "auie"
	form = cgi.FieldStorage()
	latitude = float(form.getvalue("lat"))
	longitude = float(form.getvalue("long"))
	name = form.getvalue("name")
	#	uaie = 99
	draw_sundial(math.radians(latitude), math.radians(longitude), 800, city_name = name)
#	draw_sundial(math.radians(latitude), math.radians(longitude), 800, city_name = name)
