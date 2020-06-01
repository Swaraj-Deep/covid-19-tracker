$(document).ready(function () {
    function show_alert(id, message, alert_type) {
        $(`#${id}`).html(`<div class="alert ${alert_type} alert-dismissable">${message}<button class="close" type="button" aria-hidden="true" data-dismiss="alert">&times;</button></div>`);
        $(".alert").fadeTo(5000, 500).slideUp(500, function () {
            $(".alert").remove();
        });
    }

    function get_data(url, data) {
        return fetch(`${window.origin}/${url}`, {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(data),
            cache: "no-cache",
            headers: new Headers({
                "content-type": "application/json"
            })
        });
    }
    if (localStorage.getItem("state_name")) {
        var accordion = document.getElementById('redirect');
        accordion.hidden = false;
        send_data = {
            'Data': `${localStorage.getItem("state_name")}`
        }
        get_data('__get_state_data_for_report__', send_data).then(function (response) {
            if (response.status !== 200) {
                show_alert(`alert-wrapper`, `Some error occured. Please reload the page.`, `alert-danger`);
                return false;
            } else if (response.status === 200) {
                response.json().then(function (data) {
                    state_report = data['data_state']
                    delta_data = state_report[0]['delta_data']
                    state_data = state_report[0]['state_data']
                    var state = document.getElementById('state');
                    var confirmed = document.getElementById('confirmed');
                    var active = document.getElementById('active');
                    var recovered = document.getElementById('recovered');
                    var deaths = document.getElementById('deaths');
                    var text = document.createTextNode(`State: ${state_data['state']}`);
                    state.appendChild(text);
                    text = document.createTextNode(`Confirmed: ${state_data['confirmed']}`);
                    confirmed.appendChild(text);
                    text = document.createTextNode(`Active: ${state_data['active']}`);
                    active.appendChild(text);
                    text = document.createTextNode(`Recovered: ${state_data['recovered']}`);
                    recovered.appendChild(text);
                    text = document.createTextNode(`Deaths: ${state_data['deceased']}`);
                    deaths.appendChild(text);
                    var tableRef = document.getElementById('today_update').getElementsByTagName('tbody')[0];
                    for (i in delta_data['delta']) {
                        var newRow = tableRef.insertRow();
                        var number = newRow.insertCell(0);
                        var district = newRow.insertCell(1);
                        confirmed = newRow.insertCell(2);
                        recovered = newRow.insertCell(3);
                        deaths = newRow.insertCell(4);
                        text = document.createTextNode(`${parseInt(i) + 1}`);
                        number.appendChild(text);
                        text = document.createTextNode(`${delta_data['delta'][i]['district']}`);
                        district.append(text);
                        text = document.createTextNode(`${delta_data['delta'][i]['delta']['confirmed']}`);
                        confirmed.append(text);
                        text = document.createTextNode(`${delta_data['delta'][i]['delta']['recovered']}`);
                        recovered.append(text);
                        text = document.createTextNode(`${delta_data['delta'][i]['delta']['deceased']}`);
                        deaths.append(text);
                    }
                    resource_report = data['data_resource'];
                    var tableRef = document.getElementById('resources').getElementsByTagName('tbody')[0];
                    for (i in resource_report) {
                        var newRow = tableRef.insertRow();
                        number = newRow.insertCell(0);
                        var category = newRow.insertCell(1);
                        var city = newRow.insertCell(2);
                        var name_of_organization = newRow.insertCell(3);
                        var phone_number = newRow.insertCell(4);
                        var contact = newRow.insertCell(5);
                        text = document.createTextNode(`${parseInt(i) + 1}`);
                        number.appendChild(text);
                        text = document.createTextNode(`${resource_report[i]['category']}`);
                        category.appendChild(text);
                        text = document.createTextNode(`${resource_report[i]['city']}`);
                        city.appendChild(text);
                        text = document.createTextNode(`${resource_report[i]['nameoftheorganisation']}`);
                        name_of_organization.appendChild(text);
                        text = document.createTextNode(`${resource_report[i]['phonenumber']}`);
                        phone_number.appendChild(text);
                        var contact_link = document.createElement("a");
                        contact_link.setAttribute("href", `${resource_report[i]['contact']}`);
                        contact_link.setAttribute("target", "_blank");
                        contact_link.className = "text-center text-success";
                        var linkText = document.createTextNode(`${resource_report[i]['contact']}`);
                        contact_link.appendChild(linkText);
                        contact.appendChild(contact_link);
                    }
                });
            } else {
                show_alert(`alert-wrapper`, `Opps! It's our fault.`, `alert-danger`);
                return false;
            }
        });
        localStorage.removeItem("state_name");
    } else {
        var state_districts = ["Andaman and Nicobar Islands", "Nicobars", "North and Middle Andaman", "South Andaman", "Andhra Pradesh", "Foreign Evacuees", "Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "S.P.S. Nellore", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "Y.S.R. Kadapa", "Arunachal Pradesh", "Anjaw", "Changlang", "East Kameng", "East Siang", "Kamle", "Kra Daadi", "Kurung Kumey", "Lepa Rada", "Lohit", "Longding", "Lower Dibang Valley", "Lower Siang", "Lower Subansiri", "Namsai", "Pakke Kessang", "Papum Pare", "Shi Yomi", "Siang", "Tawang", "Tirap", "Upper Dibang Valley", "Upper Siang", "Upper Subansiri", "West Kameng", "West Siang", "Assam", "Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Dima Hasao", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup", "Kamrup Metropolitan", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "South Salmara Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong", "Bihar", "Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran", "Chandigarh", "Chandigarh", "Chhattisgarh", "Balod", "Baloda Bazar", "Balrampur", "Bametara", "Bastar", "Bijapur", "Bilaspur", "Dakshin Bastar Dantewada", "Dhamtari", "Durg", "Gariaband", "Janjgir Champa", "Jashpur", "Kabeerdham", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja", "Uttar Bastar Kanker", "Gaurela Pendra Marwahi", "Delhi", "Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi", "Dadra and Nagar Haveli", "Daman and Diu", "Dadra and Nagar Haveli", "Daman", "Diu", "Goa", "North Goa", "South Goa", "Gujarat", "Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udaipur", "Dahod", "Dang", "Devbhumi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad", "Himachal Pradesh", "Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una", "Haryana", "Foreign Evacuees", "Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Italians", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar", "Jharkhand", "Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Saraikela-Kharsawan", "Simdega", "West Singhbhum", "Jammu and Kashmir", "Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Mirpur", "Muzaffarabad", "Pulwama", "Punch", "Rajouri", "Ramban", "Reasi", "Samba", "Shopiyan", "Srinagar", "Udhampur", "Karnataka", "Bagalkote", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagara", "Chikkaballapura", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir", "Kerala", "Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad", "Ladakh", "Kargil", "Leh", "Lakshadweep", "Lakshadweep", "Maharashtra", "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal", "Meghalaya", "East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ribhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills", "Manipur", "Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul", "Madhya Pradesh", "Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Niwari", "Other Region", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha", "Mizoram", "Aizawl", "Champhai", "Hnahthial", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Saitual", "Serchhip", "Nagaland", "Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto", "Odisha", "Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khordha", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangapur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh", "Punjab", "Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Pathankot", "Patiala", "Rupnagar", "S.A.S. Nagar", "Sangrur", "Shahid Bhagat Singh Nagar", "Sri Muktsar Sahib", "Tarn Taran", "Puducherry", "Karaikal", "Mahe", "Puducherry", "Yanam", "Rajasthan", "Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "BSF Camp", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Evacuees", "Ganganagar", "Hanumangarh", "Italians", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Tonk", "Udaipur", "Sikkim", "East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim", "Telangana", "Foreign Evacuees", "Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalapally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Komaram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal Malkajgiri", "Mulugu", "Nagarkurnool", "Nalgonda", "Narayanpet", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Ranga Reddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri", "Tamil Nadu", "Railway Quarantine", "Airport Quarantine", "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kancheepuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur", "Theni", "Thiruvallur", "Thiruvarur", "Thoothukkudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvannamalai", "Vellore", "Viluppuram", "Virudhunagar", "Tripura", "Dhalai", "Gomati", "Khowai", "North Tripura", "Sipahijala", "South Tripura", "Unokoti", "West Tripura", "Uttar Pradesh", "Agra", "Aligarh", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Ayodhya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kushinagar", "Lakhimpur Kheri", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Prayagraj", "Rae Bareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shrawasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi", "Uttarakhand", "Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi", "West Bengal", "Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Bardhaman", "Paschim Medinipur", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"];
        var else_part = document.getElementById("ref_nav");
        else_part.hidden = false;
        autocomplete(document.getElementById("search"), state_districts);
        get_render_data(state_districts);
    }

    function get_render_data(state_districts) {
        var btnSubmit = document.getElementById("state_district_name");
        btnSubmit.addEventListener("click", function (e) {
            var input = document.getElementById("search");
            if (validate_data(input.value, state_districts)) {
                send_data = {
                    'Data': `${input.value}`
                }
                get_data('__get_data_for_report', send_data).then(function (response) {
                    if (response.status !== 200) {
                        show_alert(`alert-wrapper`, `Some error occured. Please reload the page.`, `alert-danger`);
                        return false;
                    } else if (response.status === 200) {
                        response.json().then(function (data) {
                            data_dis_state = data['data_dis_state'];
                            var active, confirmed, recovered, deaths;
                            var a_case = 0, c_case = 0, r_case = 0, d_case = 0;
                            if (data_dis_state[0]['district_data']) {
                                document.getElementById("districts").hidden = false;
                                $("#district_data").find("tbody").empty();
                                var tableRef = document.getElementById('district_data').getElementsByTagName('tbody')[0];
                                for (var i = 0; i < data_dis_state[0]['district_data'].length; ++i) {
                                    var newRow = tableRef.insertRow();
                                    var number = newRow.insertCell(0);
                                    var district = newRow.insertCell(1);
                                    confirmed = newRow.insertCell(2);
                                    active = newRow.insertCell(3);
                                    recovered = newRow.insertCell(4);
                                    deaths = newRow.insertCell(5);
                                    text = document.createTextNode(`${parseInt(i) + 1}`);
                                    number.appendChild(text);
                                    text = document.createTextNode(`${data_dis_state[0]['district_data'][i]['district']}`);
                                    district.append(text);
                                    text = document.createTextNode(`${data_dis_state[0]['district_data'][i]['confirmed']}`);
                                    confirmed.append(text);
                                    text = document.createTextNode(`${data_dis_state[0]['district_data'][i]['active']}`);
                                    active.append(text);
                                    text = document.createTextNode(`${data_dis_state[0]['district_data'][i]['recovered']}`);
                                    recovered.append(text);
                                    text = document.createTextNode(`${data_dis_state[0]['district_data'][i]['deceased']}`);
                                    deaths.append(text);
                                    c_case += parseInt(data_dis_state[0]['district_data'][i]['confirmed']);
                                    a_case += parseInt(data_dis_state[0]['district_data'][i]['active']);
                                    r_case += parseInt(data_dis_state[0]['district_data'][i]['recovered']);
                                    d_case += parseInt(data_dis_state[0]['district_data'][i]['deceased']);
                                }
                                // Overall Condition
                                document.getElementById("overall").hidden = false;
                                confirmed = document.getElementById("confirmed2nd");
                                confirmed.innerHTML = "";
                                var state_name_p = document.getElementById("state2nd");
                                state_name_p.innerHTML = "";
                                active = document.getElementById("active2nd");
                                active.innerHTML = "";
                                deaths = document.getElementById("deaths2nd");
                                deaths.innerHTML = "";
                                recovered = document.getElementById("recovered2nd");
                                recovered.innerHTML = "";
                                var text = document.createTextNode(`State: ${data_dis_state[0]['state']}`);
                                state_name_p.appendChild(text);
                                text = document.createTextNode(`Confirmed: ${c_case}`);
                                confirmed.appendChild(text);
                                text = document.createTextNode(`Active: ${a_case}`);
                                active.appendChild(text);
                                text = document.createTextNode(`Recovered: ${r_case}`);
                                recovered.appendChild(text);
                                text = document.createTextNode(`Deaths: ${d_case}`);
                                deaths.appendChild(text);
                            } else {
                                document.getElementById("districts").hidden = true;
                                document.getElementById("overall").hidden = false;
                                confirmed = document.getElementById("confirmed2nd");
                                confirmed.innerHTML = "";
                                var state_name_p = document.getElementById("state2nd");
                                state_name_p.innerHTML = "";
                                active = document.getElementById("active2nd");
                                active.innerHTML = "";
                                deaths = document.getElementById("deaths2nd");
                                deaths.innerHTML = "";
                                recovered = document.getElementById("recovered2nd");
                                recovered.innerHTML = "";
                                var text = document.createTextNode(`District: ${data_dis_state[0]['district']}`);
                                state_name_p.appendChild(text);
                                text = document.createTextNode(`Confirmed: ${data_dis_state[0]['confirmed']}`);
                                confirmed.appendChild(text);
                                text = document.createTextNode(`Active: ${data_dis_state[0]['active']}`);
                                active.appendChild(text);
                                text = document.createTextNode(`Recovered: ${data_dis_state[0]['recovered']}`);
                                recovered.appendChild(text);
                                text = document.createTextNode(`Deaths: ${data_dis_state[0]['deceased']}`);
                                deaths.appendChild(text);
                            }
                            // Resource Joining
                            resource_state_dis = data['resource_state_dis'];
                            console.log (resource_state_dis.length);
                            if (resource_state_dis.length > 0) {
                                $("#resources2nd").find("tbody").empty();
                                document.getElementById("resources_table").hidden = false;
                                var tableRef = document.getElementById('resources2nd').getElementsByTagName('tbody')[0];
                                for (i in resource_state_dis) {
                                    var newRow = tableRef.insertRow();
                                    number = newRow.insertCell(0);
                                    var category = newRow.insertCell(1);
                                    var city = newRow.insertCell(2);
                                    var name_of_organization = newRow.insertCell(3);
                                    var phone_number = newRow.insertCell(4);
                                    var contact = newRow.insertCell(5);
                                    text = document.createTextNode(`${parseInt(i) + 1}`);
                                    number.appendChild(text);
                                    text = document.createTextNode(`${resource_state_dis[i]['category']}`);
                                    category.appendChild(text);
                                    text = document.createTextNode(`${resource_state_dis[i]['city']}`);
                                    city.appendChild(text);
                                    text = document.createTextNode(`${resource_state_dis[i]['nameoftheorganisation']}`);
                                    name_of_organization.appendChild(text);
                                    text = document.createTextNode(`${resource_state_dis[i]['phonenumber']}`);
                                    phone_number.appendChild(text);
                                    var contact_link = document.createElement("a");
                                    contact_link.setAttribute("href", `${resource_state_dis[i]['contact']}`);
                                    contact_link.setAttribute("target", "_blank");
                                    contact_link.className = "text-center text-success";
                                    var linkText = document.createTextNode(`${resource_state_dis[i]['contact']}`);
                                    contact_link.appendChild(linkText);
                                    contact.appendChild(contact_link);
                                }
                            } else {
                                $("#resources2nd").find("tbody").empty();
                                document.getElementById("resources_table").hidden = true;
                            }
                        });
                    } else {
                        show_alert(`alert-wrapper`, `Opps! It's our fault.`, `alert-danger`);
                        return false;
                    }
                });
            }
        });
    }

    function validate_data(input_string, list) {
        for (var i = 0; i < list.length; ++i) {
            if (list[i].toUpperCase() == input_string.toUpperCase()) {
                return true;
            }
        }
        return false;
    }

    function autocomplete(inp, arr) {
        var currentFocus;
        inp.addEventListener("input", function (e) {
            var a, b, i, val = this.value;
            closeAllLists();
            if (!val) { return false; }
            currentFocus = -1;
            a = document.createElement("DIV");
            a.setAttribute("id", this.id + "autocomplete-list");
            a.setAttribute("class", "autocomplete-items");
            this.parentNode.appendChild(a);
            for (i = 0; i < arr.length; i++) {
                if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                    b = document.createElement("DIV");
                    b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                    b.innerHTML += arr[i].substr(val.length);
                    b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                    b.addEventListener("click", function (e) {
                        inp.value = this.getElementsByTagName("input")[0].value;
                        closeAllLists();
                    });
                    a.appendChild(b);
                }
            }
        });
        inp.addEventListener("keydown", function (e) {
            var x = document.getElementById(this.id + "autocomplete-list");
            if (x) x = x.getElementsByTagName("div");
            if (e.keyCode == 40) {
                currentFocus++;
                addActive(x);

            } else if (e.keyCode == 38) {
                currentFocus--;
                addActive(x);

            } else if (e.keyCode == 13) {
                e.preventDefault();
                if (currentFocus > -1) {
                    if (x) x[currentFocus].click();
                }
            } else if (e.keyCode == 9) {
                var x = document.getElementById(this.id + "autocomplete-list");
                if (x) x = x.getElementsByTagName("div");
                if (x.length > 0) {
                    x[0].click();
                }

            }
        });
        function addActive(x) {
            if (!x) return false;
            removeActive(x);
            if (currentFocus >= x.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = (x.length - 1);
            x[currentFocus].classList.add("autocomplete-active");
            x[currentFocus].style.backgroundColor = 'rgba(162, 167, 172, 0.178)';
            x[currentFocus].scrollIntoView(true);
            x[currentFocus].parentNode.addEventListener("mouseover", function (e) {
                x[currentFocus].style.backgroundColor = 'White';
                currentFocus = 0;
            });
        }
        function removeActive(x) {
            for (var i = 0; i < x.length; i++) {
                x[i].style.backgroundColor = 'White';
                x[i].classList.remove("autocomplete-active");
            }
        }
        function closeAllLists(elmnt) {
            var x = document.getElementsByClassName("autocomplete-items");
            for (var i = 0; i < x.length; i++) {
                if (elmnt != x[i] && elmnt != inp) {
                    x[i].parentNode.removeChild(x[i]);
                }
            }
        }
        document.addEventListener("click", function (e) {
            closeAllLists(e.target);
        });
    }
});