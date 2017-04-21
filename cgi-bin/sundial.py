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

hours = ["V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX"]

months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "Octomber", "November", "December"]
equation_of_time = []

#TODO change this fucking shit
def normalise(angle):
	while angle < 0:
		angle += 2 * math.pi
	while angle > 2 * math.pi:
		angle -= 2 * math.pi
	return angle

def get_gnomon_base_width(latitude, scale):
	max_gnomon_size = 0.2 * scale
	if math.fabs(latitude) < math.pi / 4.0:
		return max_gnomon_size
	else:
		return max_gnomon_size / math.fabs(math.tan(latitude))

def draw_gnomon(latitude, scale):
	svg_document = svg()
	shape_builder = ShapeBuilder()

	margin = 5
	gnomon_width = get_gnomon_base_width(latitude, scale)
	gnomon_height = gnomon_width * math.fabs(math.tan(latitude))
	gnomon_base_x = margin
	gnomon_base_y = gnomon_height + margin
	cos_lat = math.cos(latitude)
	sin_lat = math.sin(latitude)

	svg_document.addElement(shape_builder.createLine(margin, gnomon_base_y, margin, margin, strokewidth=4, stroke="rgb(0, 0, 0)"))
	svg_document.addElement(shape_builder.createLine(margin + gnomon_width, gnomon_base_y, margin, margin, strokewidth=4, stroke="rgb(0, 0, 0)"))
	svg_document.addElement(shape_builder.createLine(margin - 2, gnomon_base_y, margin + gnomon_width, gnomon_base_y, strokewidth=4, stroke="rgb(231,76,60)"))

	return svg_document.getXML()


def draw_sundial(latitude, longitude, scale, time_zone = 0, time_type = "solar", city_name = ""):
	margin = 5
	width = scale - 2 * margin;
	height = scale - 2 * margin;
	outter_circle_distance = 20
	inner_circle_distance = 30
	total_circle_distance = outter_circle_distance + inner_circle_distance

	svg_document = svg()
	shape_builder = ShapeBuilder()
	svg_defs = defs()


	main_circle = shape_builder.createCircle(width / 2.0 + margin, height / 2.0 + margin, width / 2.0 - outter_circle_distance, strokewidth = 3, stroke = "black")
	secondary_circle = shape_builder.createCircle(width / 2.0  + margin, height / 2.0 + margin, width / 2.0 - total_circle_distance, strokewidth = 3, stroke = "gray")
	outside_circle = shape_builder.createCircle(width / 2.0 + margin, height / 2.0 + margin, width / 2.0, strokewidth = 3, stroke = "black")

	gnomon_base_x = width / 2.0 + margin
	gnomon_base_y = height/ 2.0 + margin
	gnomon_base_width = get_gnomon_base_width(latitude, scale)
	line_length = width / 2.0 - outter_circle_distance
	clip_path = clipPath(id="pathRect")
	clip_path.addElement(main_circle)
	svg_defs.addElement(clip_path)
	svg_document.addElement(svg_defs)

	offset = int(longitude / 15) / 2.0 - longitude / 15.0

	for time in range(5 * 4, 19 * 4 + 1):
		civil_time_correction = 0

		if time_type == "civil":
			civil_time_correction = longitude - math.radians(15 * time_zone)

		hour_angle = math.radians(time / 4.0 * 15 - 180) - civil_time_correction
		length = 0;
		color = ""
		start_length = 0;

		if time % 4 == 0:
			length = line_length
			color = "rgb(57, 112, 233)"
			start_length = 0
		elif time % 4 == 2:
			length = inner_circle_distance
			color = "rgb(89, 135, 237)"
			start_length = width / 2.0 - total_circle_distance
		else:
			length = inner_circle_distance
			color = "rgb(144, 174, 238)"
			start_length = width / 2.0 - total_circle_distance

		angle = math.atan(math.tan(hour_angle) * math.sin(latitude))

		if hour_angle < -math.pi / 2.0:
			angle -= math.pi
		elif hour_angle > math.pi / 2.0:
			angle += math.pi

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
			text = hours[(int)(time / 4) - 5]
			#text = int(math.degrees(hour_angle))
			#text = int(math.degrees(angle))
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

	svg_document.addElement(shape_builder.createLine(gnomon_base_x, gnomon_base_y, gnomon_base_x, gnomon_base_y - gnomon_base_width, strokewidth=4, stroke="rgb(231,76,60)"))
	return svg_document.getXML()

if __name__ == '__main__':
	#cgitb.enable()
	print "Content-type: image/svg+xml\n"
	form = cgi.FieldStorage()
	latitude = float(form.getvalue("lat"))
	longitude = float(form.getvalue("long"))
	zone = int(form.getvalue('zone'));
	name = form.getvalue("name")
	time = form.getvalue("time")
	print draw_sundial(math.radians(latitude), math.radians(longitude), 800, time_zone = zone, city_name = name, time_type = time)
