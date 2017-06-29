from flask import Flask, jsonify, Response, request
import requests
from requests.auth import HTTPBasicAuth
import json
from time import sleep

webio = 'http://192.168.100.30:8000/GPIO/'

app = Flask(__name__)
app.config.from_object(__name__)
app.config.from_envvar('FLASKR_SETTINGS', silent=True)


#  for WebIOpi
@app.route('/gpio/<gpioId>/<stat>', methods=['POST'])
def gpioOn(gpioId, stat):

	r = requests.post(webio + gpioId + '/value/' + stat, auth=HTTPBasicAuth('webiopi', 'raspberry'))

	resp = Response(json.dumps('OK', ensure_ascii=False).encode('utf8'))
	resp.headers['Access-Control-Allow-Origin'] = '*'		# for x-site scripting
	return resp

#  for WebIOpi
@app.route('/gpio/<gpioId>/value', methods=['GET'])
def gpioStatus(gpioId):

	r = requests.get(webio + gpioId + '/value', auth=HTTPBasicAuth('webiopi', 'raspberry'))

	result = {}
	result["value"] = r.text

	resp = Response(json.dumps(result, ensure_ascii=False).encode('utf8'))
	resp.headers['Access-Control-Allow-Origin'] = '*'		# for x-site scripting
	return resp


@app.route('/pwm/<gpioId>/ratio/<ratio>', methods=['POST'])
def pwm(gpioId, ratio):
	#r = requests.post(webio + gpioId + '/function/pwm', auth=HTTPBasicAuth('webiopi', 'raspberry'))

	fratio = float(ratio) * 0.01

	r = requests.post(webio + gpioId + '/pulseRatio/' + str(fratio), auth=HTTPBasicAuth('webiopi', 'raspberry'))

	resp = Response(json.dumps('OK', ensure_ascii=False).encode('utf8'))
	resp.headers['Access-Control-Allow-Origin'] = '*'		# for x-site scripting
	return resp



if __name__ == '__main__':
	app.run()
