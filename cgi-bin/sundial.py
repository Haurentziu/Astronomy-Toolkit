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

def draw_sundial(latitude, longitude, scale, city_name = ""):
    width = scale * 1.5;
    height = scale;

    svg_document = svg()
    shape_builder = ShapeBuilder()
    svg_defs = defs()
    #style=StyleHelper()

    #style.setFontSize(0.1 * scale)

    main_rect = shape_builder.createRect(0, 0, width, height, strokewidth = 3, stroke = "black")
    #svg_document.addElement(main_rect)

    gnomon_base_x = width / 2 - 1
    gnomon_base_y = height - 0.2 * scale
    gnomon_base_width = 0.2 * scale
    line_length = 0.5 * scale
    svg_document.addElement(shape_builder.createLine(gnomon_base_x, gnomon_base_y , gnomon_base_x, gnomon_base_y - gnomon_base_width,
     strokewidth=2, stroke="rgb(201, 54, 54)"))

    clip_path = clipPath(id="pathRect")
    clip_path.addElement(main_rect)
    svg_defs.addElement(clip_path)
    svg_document.addElement(svg_defs)

    #draw lines and numbers
    for time in range(7 * 4 - 3, 18 * 4):
        hour_angle = math.radians(time / 4.0 * 15)
        length = 0;
        color = ""
        start_length = 0;
        if time % 4 == 0:
            length = line_length
            color = "rgb(57, 112, 233)"
            start_length = 20
        elif time % 4 == 2:
            length = line_length / 2.0
            color = "rgb(89, 135, 237)"
            start_length = 20 + length
        else:
            length = line_length / 4.0
            color = "rgb(144, 174, 238)"
            start_length = 20 + 3 * length

        angle = math.atan(math.tan(hour_angle) * math.sin(latitude))
        line_start_x = gnomon_base_x + math.sin(angle) * (gnomon_base_width + start_length)
        line_start_y = gnomon_base_y - math.cos(angle) * (gnomon_base_width + start_length)

        line_end_x = line_start_x + math.sin(angle) * length
        line_end_y = line_start_y - math.cos(angle) * length

        line = shape_builder.createLine(line_start_x, line_start_y, line_end_x, line_end_y, strokewidth=2, stroke=color)
        line.set_clip_path("url(#%s)" % "pathRect")
        svg_document.addElement(line)

        if time % 4 == 0:
            text = pysvg.text.text(str(time / 4), x = line_end_x, y = line_end_y - 5, fill = "rgb(26, 56, 88)")
            text.set_text_anchor("middle")
            svg_document.addElement(text)

    #draw info
    city_name_text = pysvg.text.text(city_name, x = width / 2.0, y = height - 0.15 * scale)
    city_name_text.set_text_anchor("middle")

    #city_name_text.set_text_size("1em")
    svg_document.addElement(city_name_text)

    print svg_document.getXML()

if __name__ == '__main__':
    cgitb.enable()
    print "Content-type: image/svg+xml\n"
    form = cgi.FieldStorage()
    latitude = float(form.getvalue("lat"))
    longitude = float(form.getvalue("long"))
    name = form.getvalue("name")
    draw_sundial(math.radians(latitude), math.radians(longitude), 800, city_name = name)
