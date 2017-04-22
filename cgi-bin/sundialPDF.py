#!/usr/bin/env python
# -*- coding: UTF-8 -*-

from sundial import draw_sundial
from sundial import draw_gnomon

from reportlab.pdfgen import canvas
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from svglib.svglib import SvgRenderer
from svglib.svglib import svg2rlg
import xml.dom.minidom
from reportlab.lib.units import cm
from django.http import HttpResponse
from lxml import etree
import cgitb
import cgi
import math
import tempfile
import os

def SVG2drawing(xml_data):
    doc = etree.fromstring(xml_data)
    svgRenderer = SvgRenderer()
    drawing = svgRenderer.render(doc)
    return drawing


if __name__ == '__main__':
    cgitb.enable()

    form = cgi.FieldStorage()
    latitude = float(form.getvalue("lat"))
    longitude = float(form.getvalue("long"))
    zone = int(form.getvalue("zone"));
    name = form.getvalue("name")
    time = form.getvalue("time")

    page_width = 21.0 * cm
    page_height = 29.7 * cm
    dial_size= 21 * cm

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'inline; name=sundial; filename=sundial.pdf'

    canv = canvas.Canvas(response)
    canv.setPageSize((page_width, page_height))
    pdfmetrics.registerFont(TTFont("Arial", "../sundial/res/arial.ttf"))

    canv.setFont("Arial", 17)
    canv.setTitle("Sundial")

    lat_string = str(abs(latitude)) + ("N" if (latitude > 0) else "S")
    long_string = str(abs(longitude)) + ("E" if (latitude > 0) else "W")
    gmt_string = "GMT" + ("+" if (latitude > 0) else "-") + str(abs(zone))
    time_string = time + " time";
    title_string = "Horizontal Sundial, " + lat_string + ", " + long_string + ", "  + gmt_string + ", " + time_string

    canv.drawString(page_width / 2.0 - stringWidth(title_string, "Arial", 17) / 2.0, page_height - 1 *cm , title_string)
    sundial = draw_sundial(math.radians(latitude), math.radians(longitude), dial_size, time_zone = zone, city_name = name, time_type = time)
    gnomon = draw_gnomon(math.radians(latitude), dial_size)

    sundial_drawing = SVG2drawing(sundial)
    sundial_drawing.drawOn(canv, 0, page_height - 2 * cm)

    gnomon_drawing = SVG2drawing(gnomon)
    gnomon_drawing.drawOn(canv, 1 * cm, page_height - dial_size - 2 * cm)

    canv.showPage()
    canv.save()
    print response
