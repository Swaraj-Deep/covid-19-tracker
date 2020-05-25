import json
import requests

state_district_wise = "https://api.covid19india.org/v2/state_district_wise.json"
resources = "https://api.covid19india.org/resources/resources.json"
overall_data = "https://api.rootnet.in/covid19-in/stats/latest"
testing = "https://api.rootnet.in/covid19-in/stats/testing/latest"
hospital_beds = "https://api.rootnet.in/covid19-in/hospitals/beds"


def check_error(response, api_url) -> "JSON or None":
    if response.status_code >= 500:
        print('[!] [{0}] Server Error'.format(response.status_code))
        return None
    elif response.status_code == 404:
        print('[!] [{0}] URL not found: [{1}]'.format(
            response.status_code, api_url))
        return None
    elif response.status_code == 401:
        print('[!] [{0}] Authentication Failed'.format(response.status_code))
        return None
    elif response.status_code == 400:
        print('[!] [{0}] Bad Request'.format(response.status_code))
        return None
    elif response.status_code >= 300:
        print('[!] [{0}] Unexpected Redirect'.format(response.status_code))
        return None
    elif response.status_code == 200:
        data = json.loads(response.content.decode('utf-8'))
        return data
    else:
        print('[?] Unexpected Error: [HTTP {0}]: Content: {1}'.format(
            response.status_code, response.content))
    return None


def get_state_district_wise_data() -> 'JSON':
    response = requests.get(state_district_wise)
    data = check_error(response, state_district_wise)
    if data != None:
        list_states = []
        list_deltas = []
        for states in data:
            temp_state = {}
            temp_state["state"] = states["state"]
            temp_district_data = []
            for district_data in states["districtData"]:
                temp = {}
                temp_district = {}
                temp_district["district"] = district_data["district"]
                temp_district["active"] = district_data["active"]
                temp_district["confirmed"] = district_data["confirmed"]
                temp_district["deceased"] = district_data["deceased"]
                temp_district["recovered"] = district_data["recovered"]
                temp["district"] = district_data["district"]
                temp["delta"] = district_data["delta"]
                list_deltas.append(temp)
                temp_district_data.append(temp_district)
                temp_state["district_data"] = temp_district_data
            list_states.append(temp_state)
        state_data = []
        for item in list_states:
            temp_dict = {}
            if item['state'] != 'State Unassigned':
                temp_dict['state'] = item['state']
                district_data = item['district_data']
                active = 0
                deceased = 0
                recoverd = 0
                confirmed = 0
                for dist in district_data:
                    active = active + int(dist['active'])
                    deceased = deceased + int(dist['deceased'])
                    confirmed = confirmed + int(dist['confirmed'])
                    recoverd = recoverd + int(dist['recovered'])
                temp_dict['active'] = str(active)
                temp_dict['deceased'] = str(deceased)
                temp_dict['recovered'] = str(recoverd)
                temp_dict['confirmed'] = str(confirmed)
                state_data.append(temp_dict)
    ret_list = []
    ret_list.append(list_deltas)
    ret_list.append(list_states)
    ret_list.append(state_data)
    return ret_list


def get_resources() -> "JSON":
    response = requests.get(resources)
    data = check_error(response, resources)
    if data != None:
        return data


def get_overall() -> "list":
    response = requests.get(overall_data)
    data = check_error(response, overall_data)
    if data != None:
        data = data["data"]
        official_summary = data["summary"]
        unofficial_summary = data["unofficial-summary"][0]
        regional = data["regional"]
        ret_list = []
        ret_list.append(official_summary)
        ret_list.append(unofficial_summary)
        ret_list.append(regional)
    return ret_list


def get_testing() -> "JSON":
    response = requests.get(testing)
    data = check_error(response, testing)
    if data != None:
        data = data["data"]
        return data


def get_hospital_beds() -> "JSON":
    response = requests.get(hospital_beds)
    data = check_error(response, hospital_beds)
    if data != None:
        data = data["data"]
        summary = data["summary"]
        regional = data["regional"]
        ret_list = []
        ret_list.append(summary)
        ret_list.append(regional)
        return ret_list


if __name__ == "__main__":
    lst = get_state_district_wise_data()
    # print (lst[0])
