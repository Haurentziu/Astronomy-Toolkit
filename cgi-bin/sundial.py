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
import pysvg.parser
import math
import cgitb
import cgi

hours = ["V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX"]

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
days = ["1", "15"]
equation_of_time = [
	[-4, -9], 	#jan
	[-14, -15],	#feb
	[-12, -9],	#mar
	[-4, 0],	#apr
	[3, 4],	#may
	[2, 0],	#june
	[-4, -6],	#july
	[-7, -4],	#august
	[0, 5],	#sep
	[10, 14],	#oct
	[16, 15],	#nov
	[11, 5],	#dec

]

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
	relative_scale = scale / 800.0
	margin = 5
	gnomon_width = get_gnomon_base_width(latitude, scale)
	gnomon_height = gnomon_width * math.fabs(math.tan(latitude))
	gnomon_base_x = margin
	gnomon_base_y = gnomon_height + margin
	cos_lat = math.cos(latitude)
	sin_lat = math.sin(latitude)

	arrow_width = 34 * relative_scale
	arrow_height = 10 * relative_scale
	arrow_x = margin + 10 * relative_scale
	arrow_y = gnomon_base_y - 2 * arrow_height - margin

	if(latitude > 0):
		arrow_x = arrow_x + arrow_width * 1.5
		arrow_y = arrow_y + arrow_height


	rotation = -180 if(latitude > 0) else 0
	arrow_drawing = arrow(arrow_x, arrow_y, arrow_width, arrow_height, stroke = "#000", fill="rgb(231,76,60)")
	arrow_drawing.set_transform("rotate(" + str(-rotation) + ","  + str(arrow_x) + ", " + str(arrow_y) + ")")
	svg_document.addElement(arrow_drawing)

	svg_document.addElement(shape_builder.createLine(margin, gnomon_base_y, margin, margin, strokewidth=4, stroke="rgb(0, 0, 0)"))
	svg_document.addElement(shape_builder.createLine(margin + gnomon_width, gnomon_base_y, margin, margin, strokewidth=4, stroke="rgb(0, 0, 0)"))
	svg_document.addElement(shape_builder.createLine(margin - 2, gnomon_base_y, margin + gnomon_width, gnomon_base_y, strokewidth=4, stroke="rgb(231,76,60)"))

	return svg_document.getXML()

def arrow(x, y, width, height, forward=True, stroke="blue", fill="blue", strokewidth=1):
	sb = ShapeBuilder()
	arrowshape = [(0, 0), (width, 0), (width, -height*0.5), (width*1.5, height*0.5), (width, height*1.5), (width, height), (0, height)]

	if not forward: # Change the direction
	    arrowshape = [(width*1.2 - a, b) for (a, b) in arrowshape]
	arrowshape = [(a+x, b+y) for (a, b) in arrowshape]
	return sb.createPolygon(points=sb.convertTupleArrayToPoints(arrowshape),strokewidth=strokewidth, stroke=stroke, fill=fill)



def draw_sundial(latitude, longitude, scale, time_zone = 0, time_type = "solar", city_name = ""):
	margin = 5
	relative_scale = scale / 800.0;
	width = scale - 2 * margin;
	height = scale - 2 * margin;
	outter_circle_distance = 35 * relative_scale
	inner_circle_distance = 0
	total_circle_distance = outter_circle_distance + inner_circle_distance

	svg_document = svg()
	shape_builder = ShapeBuilder()
	svg_defs = defs()


	main_circle = shape_builder.createCircle(width / 2.0 + margin, height / 2.0 + margin, width / 2.0 - outter_circle_distance, strokewidth = 3, stroke = "black")
	#secondary_circle = shape_builder.createCircle(width / 2.0  + margin, height / 2.0 + margin, width / 2.0 - total_circle_distance, strokewidth = 3, stroke = "gray")
	outside_circle = shape_builder.createCircle(width / 2.0 + margin, height / 2.0 + margin, width / 2.0, strokewidth = 3, stroke = "black")

	gnomon_base_x = width / 2.0 + margin
	gnomon_base_y = height/ 2.0 + margin
	gnomon_base_width = get_gnomon_base_width(latitude, scale)
	line_length = width / 2.0 - outter_circle_distance
	clip_path = clipPath(id="pathRect")
	clip_path.addElement(main_circle)
	svg_defs.addElement(clip_path)
	svg_document.addElement(svg_defs)

	style = pysvg.builders.StyleBuilder()
	style.setFontFamily("Arial,Helvetica")

	style.setFontSize(str(20 * relative_scale) + "px");
	for time in range(6 * 4, 18 * 4 + 1):
		civil_time_correction = 0

		if time_type == "civil":
			civil_time_correction = longitude - math.radians(15 * time_zone)

		hour_angle = math.radians(time / 4.0 * 15 - 180) + civil_time_correction
		length = 0;
		color = ""
		start_length = 0;
		stroke_width = 0;

		if time % 4 == 0:
			length = line_length
			color = "rgb(57, 112, 233)"
			start_length = 0
			stroke_width = 3
		elif time % 4 == 2:
			length = line_length #inner_circle_distance
			color = "rgb(89, 135, 237)"
			stroke_width = 2
			start_length = 0 #width / 2.0 - total_circle_distance
		else:
			length = line_length #inner_circle_distance
			color = "rgb(144, 174, 238)"
			start_length = 0 #width / 2.0 - total_circle_distance
			stroke_width = 1

		angle = math.atan(math.tan(hour_angle) * math.sin(latitude))

		if hour_angle < -math.pi / 2.0:
			angle -= math.pi
		elif hour_angle > math.pi / 2.0:
			angle += math.pi

		line_start_x = gnomon_base_x + math.sin(angle) * start_length
		line_start_y = gnomon_base_y - math.cos(angle) * start_length
		line_end_x = line_start_x + math.sin(angle) * length
		line_end_y = line_start_y - math.cos(angle) * length

		line = shape_builder.createLine(line_start_x, line_start_y, line_end_x, line_end_y, strokewidth=stroke_width, stroke=color)
		line.set_clip_path("url(#%s)" % "pathRect")
		svg_document.addElement(line)

		if time % 4 == 0:
			cos_angle = math.cos(angle)
			sin_angle = math.sin(angle)
			text_x = line_end_x + math.sin(angle) * outter_circle_distance / 4.0
			text_y = line_end_y - math.cos(angle) * outter_circle_distance / 4.0
			hour = hours[(int)(time / 4) - 5]
			#text = int(math.degrees(hour_angle))
			#text = int(math.degrees(angle))
			deg_angle = str(int(math.degrees(angle)))
			text = pysvg.text.text(hour, x = text_x, y = text_y, fill = "rgb(26, 56, 88)")
			text.set_text_anchor("middle")
			text.set_transform("rotate("+ deg_angle +", " + str(text_x) + "," + str(text_y) + ")")
			text.set_style(style.getStyle())
			#text.set_rotate(math.degrees(angle))
			svg_document.addElement(text)

    #draw info
	city_name_text = pysvg.text.text(city_name, x = width / 2.0, y = height - 0.15 * scale)
	city_name_text.set_text_anchor("middle")

	svg_document.addElement(outside_circle)
	svg_document.addElement(main_circle)
	#svg_document.addElement(secondary_circle)

    #city_name_text.set_text_size("1em")
	#svg_document.addElement(city_name_text)

	#draw correction
	style.setFontSize(str(15 * relative_scale) + "px")
	start_y = 100 * relative_scale;
	dist_y = 16 * relative_scale;
	dist_x = 100 * relative_scale

	for i in range(0, 12):
		for j in range(0, 2):
			text = months[i] + " " + days[j] + ": " + ('{0:+d}'.format(equation_of_time[i][j]))
			x = width / 2.0 - dist_x / 2.0 + j * dist_x
			y = height / 2.0 + start_y + dist_y * (i + 1.5)
			correction_text = pysvg.text.text(text, x = x, y = y)
			correction_text.set_text_anchor("middle")
			correction_text.set_style(style.getStyle())
			svg_document.addElement(correction_text)

	style.setFontSize(str(20 * relative_scale) + "px")
	correction_text = pysvg.text.text("Equation Of Time (minutes)", x = width / 2.0, y = height / 2.0 + start_y)
	correction_text.set_text_anchor("middle")
	correction_text.set_style(style.getStyle())
	svg_document.addElement(correction_text)

	rotation =  math.copysign(90, latitude)
	arrow_width = 100 * relative_scale
	arrow_height = 30 * relative_scale

	arrow_x = width - total_circle_distance - margin - 180 * relative_scale
	arrow_y = width / 2.0 + 250 * relative_scale

	if latitude < 0:
		arrow_x = arrow_x +  arrow_height
		arrow_y = arrow_y - 1.5 * arrow_width

	arrow_drawing = arrow(arrow_x, arrow_y, arrow_width, arrow_height, stroke = "#000", fill="rgb(231,76,60)")
	arrow_drawing.set_transform("rotate(" + str(-rotation) + ","  + str(arrow_x) + ", " + str(arrow_y) + ")")
	svg_document.addElement(arrow_drawing)

	svg_document.addElement(shape_builder.createLine(gnomon_base_x, gnomon_base_y, gnomon_base_x, gnomon_base_y - gnomon_base_width, strokewidth=4, stroke="rgb(231,76,60)"))
	return svg_document.getXML()

if __name__ == '__main__':
	cgitb.enable()
	print "Content-type: image/svg+xml\n"
	form = cgi.FieldStorage()
	latitude = float(form.getvalue("lat"))
	longitude = float(form.getvalue("long"))
	zone = int(form.getvalue('zone'));
	name = form.getvalue("name")
	time = form.getvalue("time")
	#print draw_gnomon(math.radians(latitude), 800.0)
	print draw_sundial(math.radians(latitude), math.radians(longitude), 800, time_zone = zone, city_name = name, time_type = time)
