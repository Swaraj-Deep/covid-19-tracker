from flask import Flask, render_template, request, redirect, session, make_response, jsonify, send_from_directory, abort
from decimal import Decimal
from werkzeug.utils import secure_filename
import matplotlib.pyplot as plt
import os
import os.path
import datapoint.scraper

app = Flask(__name__)
app.config['FILE_UPLOADS'] = os.getcwd() + '/static/uploads'
app.secret_key = 'kldjlkmxcvioermklxjos90873489*&86*&I09'

resources_summ = []
detailed_resources_data = []
hospital_beds = []


@app.route('/')
def dash_board() -> 'html':
    get_list = datapoint.scraper.get_overall()
    return render_template('summary.html', the_title='Main Page', official_data=get_list[0], unofficial_data=get_list[1], regional_data=get_list[2])


@app.route('/update')
def today_update() -> 'html':
    ret_list = datapoint.scraper.get_state_district_wise_data()
    return render_template('todaysupdate.html', the_title='Today\'s Update', delta_data=ret_list[0])


@app.route('/resources')
def resources() -> 'html':
    global resources_summ
    if len(resources_summ) == 0:
        resources_summ = datapoint.scraper.get_testing()
    global detailed_resources_data
    if len(detailed_resources_data) == 0:
        detailed_resources_data = datapoint.scraper.get_resources()[
            "resources"]
    global hospital_beds
    if len(hospital_beds) == 0:
        hospital_beds = datapoint.scraper.get_hospital_beds()
    hospital_beds = hospital_beds[0]
    return render_template('resources.html', the_title='Resources', testing_data=resources_summ, detailed_data=detailed_resources_data, hospital_data=hospital_beds)


@app.route('/graph')
def graph() -> 'html':
    get_list = datapoint.scraper.get_overall()
    return render_template('graph.html', the_title='Draw Graphs', confirmed=get_list[1]["total"], active=get_list[1]["active"], recovered=get_list[1]["recovered"], deaths=get_list[1]["deaths"])


@app.route('/report')
def report() -> 'html':
    return render_template('report.html', the_title='View Reports')


@app.route('/__get_map_data__', methods=['POST'])
def get_map_data() -> 'json':
    try:
        res_lst = datapoint.scraper.get_state_district_wise_data()
        response = {
            'data': res_lst[2]
        }
    except Exception as e:
        print(e)
    return make_response(jsonify(response), 200)


def state_delta(state_name) -> 'list':
    state_name = state_name.lower()
    district_data = datapoint.scraper.get_state_district_wise_data()
    district_data_delta = district_data[0]
    district_data_dict = {}
    list_data = []
    for items in district_data_delta:
        if items["state"].lower() == state_name:
            district_data_dict["delta_data"] = items
    state_data = district_data[2]
    for items in state_data:
        if items['state'].lower() == state_name:
            district_data_dict["state_data"] = items
    list_data.append(district_data_dict)
    return list_data


def resource_state(state_name) -> 'list':
    state_name = state_name.lower()
    global detailed_resources_data
    if len(detailed_resources_data) == 0:
        detailed_resources_data = datapoint.scraper.get_resources()[
            "resources"]
    list_resource_data = []
    for items in detailed_resources_data:
        if items["state"].lower() == state_name:
            list_resource_data.append(items)
    return list_resource_data


@app.route('/__get_state_data_for_report__', methods=['POST'])
def get_state_data_for_report() -> 'json':
    try:
        state_name = request.json['Data']
        response = {
            'data_state': state_delta(state_name),
            'data_resource': resource_state(state_name)
        }
    except Exception as e:
        print(e)
    return make_response(jsonify(response), 200)


def data_dis_state(dis_state_name) -> 'list':
    dis_state_name = dis_state_name.lower()
    district_data = datapoint.scraper.get_state_district_wise_data()
    district_data_overall = district_data[1]
    retdata = []
    for items in district_data_overall:
        if items['state'].lower() == dis_state_name:
            retdata.append(items)
            return retdata
        for item in items['district_data']:
            if item['district'].lower() == dis_state_name:
                retdata.append(item)
                return retdata


def resource_state_dis(dis_state_name) -> 'list':
    dis_state_name = dis_state_name.lower()
    global detailed_resources_data
    if len(detailed_resources_data) == 0:
        detailed_resources_data = datapoint.scraper.get_resources()[
            "resources"]
    list_resource_data = []
    for items in detailed_resources_data:
        if items['state'].lower() == dis_state_name:
            list_resource_data.append(items)
        if items['city'].lower() == dis_state_name:
            list_resource_data.append(items)
    return list_resource_data


@app.route('/__get_data_for_report', methods=['POST'])
def get_data_for_report() -> 'json':
    try:
        name = request.json['Data']
        response = {
            'data_dis_state': data_dis_state(name),
            'resource_state_dis': resource_state_dis(name)
        }
    except Exception as e:
        print(e)
    return make_response(jsonify(response), 200)


if __name__ == '__main__':
    app.run(debug=True)
