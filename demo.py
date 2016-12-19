from flask import Flask
from flask import request, url_for, redirect, session, escape, abort
from flask import render_template
app = Flask(__name__)
app.secret_key= "ZDFGHDHDFGHJGHK#@#$R%TWDFGSDFASDA"
import argparse
import json
import logging
import urllib
import urllib2
import md5
import time

logger = logging.getLogger("EAN demo")
logger.setLevel(logging.INFO)
ch=logging.StreamHandler()
ch.setLevel(logging.INFO)
logger.addHandler(ch)


@app.route('/', methods=['POST', 'GET'])
def Main():
    #filter user here
    return render_template('index.html')

@app.route('/hotel-list', methods=['POST','GET'])
def Data():

    destination=request.form.get("destination","")
    adults=request.form.get("adults","")
    occupancy=request.form.get("occupancy","")
    locales=request.form.get("locales","")
    currency=request.form.get("currency","")
    minStar=request.form.get("minStar","")
    maxStar=request.form.get("maxStar","")
    checkIn=request.form.get("checkIn","")
    checkOut=request.form.get("checkOut","")

  #  destination = 'Honolulu'

    service = 'http://api.ean.com/ean-services/rs/hotel/'
    version = 'v3/'
    method = 'list/'
   # otherElementsStr0 ='&cid=497259&minorRev=30&customerUserAgent=PARTNER_WEBSITE&customerIpAddress=123.118.20.148&city='+ destination +'&stateProvinceCode=HI&countryCode=US&numberOfResults=5'
    param1 = '&destinationString='+ destination +'&numberOfResults=5&arrivalDate='+ checkIn +'&departureDate=' + checkOut+ '&RoomGroup=1&room' + occupancy + "=" + adults + "&currencyCode=" + currency
    param2 = '&minStarRating=' + minStar + '&maxStarRating=' + maxStar
    param3 ='&cid=497259&minorRev=30&customerUserAgent=PARTNER_WEBSITE&customerIpAddress=123.118.20.148'

    apiKey = '363thtsppo32k6ek06c75jkn3e'
    secret = '4ipf5b65h1t63'

    hash = md5.new()
    # seconds since GMT Epoch
    timestamp = str(int(time.time()))
    logger.info(timestamp)
    sig = md5.new(apiKey + secret + timestamp).hexdigest()
    url = service + version + method+ '?apiKey=' + apiKey + '&sig=' + sig + param1 + param2 + param3
    print url
    logger.info("hotel list url: " + url)
    feedback = urllib2.urlopen(url).read()

    output={}
    output["requestUrl"] = url
    output["result"] = feedback

    return json.dumps(output)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Web Server for EAN demo')
    parser.add_argument('--port', type=int, help='Port number for deployment')
    parser.add_argument('--debug', action='store_true', help='Run in debug mode')

    args = parser.parse_args()
    if args.debug:
        logger.setLevel(logging.DEBUG)
    else:
        logger.setLevel(logging.INFO)
    app.run(host='localhost',port='5050',debug=args.debug)

