from flask import Flask, jsonify, Response, request
import requests
from requests.auth import HTTPBasicAuth
import json
from time import sleep

url = 'http://weather.livedoor.com/forecast/webservice/json/v1'
webio = 'http://192.168.100.30:8000/'

app = Flask(__name__)
app.config.from_object(__name__)
app.config.from_envvar('FLASKR_SETTINGS', silent=True)

@app.route('/weather')
def weather():
	city = request.args.get('city', '130010', type=str)
	date = request.args.get('date', '今日', type=str)

	payload = {
		'city' : city,
	}
	r = requests.get(url, params=payload)
	responseDict = r.json()

	#print('天気概要；', responseDict['description']['text'])

	result = {}

	result['description'] = responseDict['description']['text']

	#  Get weather information 
	for forecast in responseDict['forecasts']:
		if forecast['dateLabel'] == date:
			result['telop'] = forecast['telop']
			if forecast['temperature']['min'] is not None:
				result['mintemp'] = forecast['temperature']['min']['celsius']

			if forecast['temperature']['max'] is not None:
				result['maxtemp'] = forecast['temperature']['max']['celsius']

			break

	#  Return response
	resp = Response(json.dumps(result, ensure_ascii=False).encode('utf8'))
	resp.headers['Access-Control-Allow-Origin'] = '*'		# for x-site scripting
	return resp

#  for WebIOpi
@app.route('/gpio/<gpioId>/<stat>', methods=['POST'])
def gpioOn(gpioId, stat):

	r = requests.post(webio + 'GPIO/' + gpioId + '/value/' + stat, auth=HTTPBasicAuth('webiopi', 'raspberry'))
	print(r)
	resp = Response(json.dumps('OK', ensure_ascii=False).encode('utf8'))
	resp.headers['Access-Control-Allow-Origin'] = '*'		# for x-site scripting
	return resp

#  for WebIOpi
@app.route('/gpio/<gpioId>/value', methods=['GET'])
def gpioStatus(gpioId):

	r = requests.get(webio + 'GPIO/'+ gpioId + '/value', auth=HTTPBasicAuth('webiopi', 'raspberry'))

	result = {}
	result["value"] = r.text

	resp = Response(json.dumps(result, ensure_ascii=False).encode('utf8'))
	resp.headers['Access-Control-Allow-Origin'] = '*'		# for x-site scripting

	return resp


@app.route('/pwm/<gpioId>/ratio/<ratio>', methods=['POST'])
def pwm(gpioId, ratio):
	#r = requests.post(webio + gpioId + '/function/pwm', auth=HTTPBasicAuth('webiopi', 'raspberry'))

	fratio = float(ratio) * 0.01

	r = requests.post(webio + 'GPIO/' + gpioId + '/pulseRatio/' + str(fratio), auth=HTTPBasicAuth('webiopi', 'raspberry'))

	resp = Response(json.dumps('OK', ensure_ascii=False).encode('utf8'))
	resp.headers['Access-Control-Allow-Origin'] = '*'		# for x-site scripting
	sleep(0.1)
	return resp


@app.route('/pwm4Write/<ratio>', methods=['POST'])
def pwm4Write(ratio):
	#r = requests.post(webio + gpioId + '/function/pwm', auth=HTTPBasicAuth('webiopi', 'raspberry'))

	#fratio = float(ratio) * 0.01
	print(ratio)
	r = requests.post(webio + 'macros/pwmWrite4/' + ratio + ',0', auth=HTTPBasicAuth('webiopi', 'raspberry'))

	resp = Response(json.dumps('OK', ensure_ascii=False).encode('utf8'))
	resp.headers['Access-Control-Allow-Origin'] = '*'		# for x-site scripting
	sleep(0.15)
	print(r)
	return resp



if __name__ == '__main__':
	app.run()
