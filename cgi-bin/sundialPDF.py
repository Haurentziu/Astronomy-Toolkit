#!/usr/bin/env python
# -*- coding: UTF-8 -*-

from sundial import draw_sundial
from sundial import draw_gnomon

from reportlab.pdfgen import canvas
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
    canv.setTitle("Sundial")
    sundial = draw_sundial(math.radians(latitude), math.radians(longitude), dial_size, time_zone = zone, city_name = name, time_type = time)
    gnomon = draw_gnomon(math.radians(latitude), dial_size)

    sundial_drawing = SVG2drawing(sundial)
    sundial_drawing.drawOn(canv, 0, page_height)

    gnomon_drawing = SVG2drawing(gnomon)
    gnomon_drawing.drawOn(canv, page_width / 2.0, page_height - dial_size - 1 * cm)
    canv.showPage()
    canv.save()

    #os.close(temp_path[0])
    print response
