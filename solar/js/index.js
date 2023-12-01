const data = {
    "type":"FeatureCollection",
    "features":[
        {"type":"Feature","properties":{"GEOID_10":"3400506670","Municipality":"Bordentown City","County":"Burlington","State":"NJ","Designation Level":"Bronze","DVRPC SolSmart Advisor Cohort":"2","field_7":""},"geometry":null},
        {"type":"Feature","properties":{"GEOID_10":"3400728770","Municipality":"Haddonfield Borough","County":"Camden","State":"NJ","Designation Level":"Silver","DVRPC SolSmart Advisor Cohort":"2","field_7":""},"geometry":null},
        {"type":"Feature","properties":{"GEOID_10":"34007","Municipality":"","County":"Camden","State":"NJ","Designation Level":"Bronze","DVRPC SolSmart Advisor Cohort":"2","field_7":""},"geometry":null},
        {"type":"Feature","properties":{"GEOID_10":"3402180240","Municipality":"West Windsor Township","County":"Mercer","State":"NJ","Designation Level":"Silver","DVRPC SolSmart Advisor Cohort":"2","field_7":""},"geometry":null},
        {"type":"Feature","properties":{"GEOID_10":"4201719784","Municipality":"Doylestown Borough","County":"Bucks","State":"PA","Designation Level":"Silver","DVRPC SolSmart Advisor Cohort":"2","field_7":""},"geometry":null},
        {"type":"Feature","properties":{"GEOID_10":"4202939352","Municipality":"Kennett Square Borough","County":"Chester","State":"PA","Designation Level":"Bronze","DVRPC SolSmart Advisor Cohort":"2","field_7":""},"geometry":null},
        {"type":"Feature","properties":{"GEOID_10":"4204513208","Municipality":"Chester CIty","County":"Delaware","State":"PA","Designation Level":"Bronze","DVRPC SolSmart Advisor Cohort":"1","field_7":""},"geometry":null},
        {"type":"Feature","properties":{"GEOID_10":"4204522584","Municipality":"Edgmont Township","County":"Delaware","State":"PA","Designation Level":"Bronze","DVRPC SolSmart Advisor Cohort":"1","field_7":""},"geometry":null},
        {"type":"Feature","properties":{"GEOID_10":"4204541440","Municipality":"Lansdowne Borough","County":"Delaware","State":"PA","Designation Level":"Bronze","DVRPC SolSmart Advisor Cohort":"2","field_7":""},"geometry":null},
        {"type":"Feature","properties":{"GEOID_10":"4204548480","Municipality":"Media Borough","County":"Delaware","State":"PA","Designation Level":"Bronze","DVRPC SolSmart Advisor Cohort":"1","field_7":""},"geometry":null},
        {"type":"Feature","properties":{"GEOID_10":"4204549504","Municipality":"Millbourne Borough","County":"Delaware","State":"PA","Designation Level":"Bronze","DVRPC SolSmart Advisor Cohort":"2","field_7":""},"geometry":null},
        {"type":"Feature","properties":{"GEOID_10":"4209112968","Municipality":"Cheltenham Township","County":"Montgomery","State":"PA","Designation Level":"Bronze","DVRPC SolSmart Advisor Cohort":"1","field_7":""},"geometry":null},
        {"type":"Feature","properties":{"GEOID_10":"4209144976","Municipality":"Lower Merion Township","County":"Montgomery","State":"PA","Designation Level":"Bronze","DVRPC SolSmart Advisor Cohort":"1","field_7":""},"geometry":null},
        {"type":"Feature","properties":{"GEOID_10":"4209162416","Municipality":"Pottstown Borough","County":"Montgomery","State":"PA","Designation Level":"Bronze","DVRPC SolSmart Advisor Cohort":"1","field_7":""},"geometry":null},
        {"type":"Feature","properties":{"GEOID_10":"4209179136","Municipality":"Upper Merion Township","County":"Montgomery","State":"PA","Designation Level":"Bronze","DVRPC SolSmart Advisor Cohort":"1","field_7":""},"geometry":null},
        {"type":"Feature","properties":{"GEOID_10":"42091","Municipality":"","County":"Montgomery","State":"PA","Designation Level":"Silver","DVRPC SolSmart Advisor Cohort":"2","field_7":""},"geometry":null},
        {"type":"Feature","properties":{"GEOID_10":"4210160000","Municipality":"Philadelphia City","County":"Philadelphia","State":"PA","Designation Level":"Gold","DVRPC SolSmart Advisor Cohort":"1","field_7":""},"geometry":null}
    ]
}

let pending = ['in', 'geoid']
let bronze = ['in', 'geoid']
let silver = ['in', 'geoid']
let gold = ['in', 'geoid']
let active = ['in', 'geoid']
let activeCounty = ['in', 'geoid', '34007', '42091'] // ok to hard code because these won't change

data['features'].forEach(function(feature) {
    const properties = feature.properties
    const designation = properties['Designation Level']

    // add all to active for outlines
    active.push(properties['GEOID_10'])

    switch(designation) {
        case 'Gold':
            gold.push(properties['GEOID_10'])
            break
        case 'Silver':
            silver.push(properties['GEOID_10'])
            break
        case 'Bronze':
            bronze.push(properties['GEOID_10'])
            break
        default:
            pending.push(properties['GEOID_10'])
    }
})


/****** Map Interactivity Functions ******/
const scrollToAccordion = function(e){
    const props = e.features[0].properties
    let area = props.geoid ? props.geoid : props.name +'-accordion'
    const li = document.getElementById(area)

    // scroll to and open the accordion
    li.scrollIntoView({
        behavior: 'smooth'
    })

    const accordion = li.children[0]
    customToggle(accordion)
}

const generatePopup = function(e, popup){
    const mcd = e.features[0].properties.name

    // popup is defined in the general map.on('load') context so that it can be removed on mouseleave
    popup.setLngLat(e.lngLat)
    .setHTML('<p class="popup-title">'+mcd+'</p>')
    .addTo(map)
}


/****** General Map Functions ******/
mapboxgl.accessToken = 'pk.eyJ1IjoibW1vbHRhIiwiYSI6ImNqZDBkMDZhYjJ6YzczNHJ4cno5eTcydnMifQ.RJNJ7s7hBfrJITOBZBdcOA'

const stylesheet = {
  "version": 8,
  "sources": {
    "counties": {
      "type": "vector",
      "url": "https://tiles.dvrpc.org/data/dvrpc-municipal.json"
    }
  },
  "layers": [
    {
      "id": "county-fill",
      "type": "fill",
      "source": "counties",
      "source-layer": "county",
      "layout": {},
      "paint": {
          "fill-color": "#262322",
          "fill-opacity": 0.8
      },
      "filter": [
          "==",
          "dvrpc",
          "Yes"
        ],
    },
    {
        "id": "camden-bronze",
        "source": "counties",
        "source-layer": "county",
        "type": "fill",
        "layout":{
            "visibility": "none"
        },
        "paint": {
            "fill-color": "#cd7f32"
        },
        "filter": ["==", "name", "Camden"]
    },
    {
        "id": "montgomery-silver",
        "source": "counties",
        "source-layer": "county",
        "type": "fill",
        "layout":{
            "visibility": "none"
        },
        "paint": {
            "fill-color": "#c0c0c0"
        },
        "filter": ["==", "name", "Montgomery"]
    },
    {
        "id": "municipality-outline",
        "type": "line",
        "source": "counties",
        "source-layer": "municipalities",
        "paint": {
            'line-width': 0.3, 
            'line-color': '#efefef' 
        }
    },
    {
        "id": "county-outline",
        "type": "line",
        "source": "counties",
        "source-layer": "county",
        "paint": {
            'line-width': 1.3, 
            'line-color': '#eef0f2'
        },
        "filter": [
          "==",
          "dvrpc",
          "Yes"
        ]
    },
    {
        "id": "bronze-designation",
        "source": "counties",
        "source-layer": "municipalities",
        "type": "fill",
        "paint": {
            "fill-color": "#cd7f32"
        },
        "filter": bronze
    },
    {
        "id": "silver-designation",
        "source": "counties",
        "source-layer": "municipalities",
        "type": "fill",
        "paint": {
            "fill-color": "#c0c0c0"
        },
        "filter": silver
    },
    {
        "id": "gold-designation",
        "source": "counties",
        "source-layer": "municipalities",
        "type": "fill",
        "paint": {
            "fill-color": "#ffd700"
        },
        "filter": gold
    },
    {
        "id": "pending-designation",
        "source": "counties",
        "source-layer": "municipalities",
        "type": "fill",
        "paint": {
            "fill-color": "#fff"
        },
        "filter": pending
    },
    {
        "id": "active-outline",
        "type": "line",
        "source": "counties",
        "source-layer": "municipalities",
        "paint": {
            'line-width': 1.5, 
            'line-color': '#fff' 
        },
        "filter": active
    }
  ]
}

const map = new mapboxgl.Map({
    container: 'map',
    style: stylesheet,
    attributionControl: false,
    center: [-75.2273, 40.071],
    zoom: 3
});

map.on('load', function() {
    const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true
    })

    // hover over designation layers and change mouse setting
    map.on('mousemove', 'bronze-designation', function(e){
        map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mousemove', 'silver-designation', function(e){
        map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mousemove', 'gold-designation', function(e){
        map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mousemove', 'pending-designation', function(e){
        map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mousemove', 'camden-bronze', function(e){
        map.getCanvas().style.cursor = 'pointer'
    })
    map.on('mousemove', 'montgomery-silver', function(e){
        map.getCanvas().style.cursor = 'pointer'
    })

    // hover over designation layres and genreate a popup (mouseenter so it doesn't generate a billion of em)
    map.on('mouseenter', 'bronze-designation', function(e){
        generatePopup(e, popup)
    })
    map.on('mouseenter', 'silver-designation', function(e){
        generatePopup(e, popup)
    })
    map.on('mouseenter', 'gold-designation', function(e){
        generatePopup(e, popup)
    })
    map.on('mouseenter', 'pending-designation', function(e){
        generatePopup(e, popup)
    })
    map.on('mouseenter', 'camden-bronze', function(e){
        generatePopup(e, popup)
    })
    map.on('mouseenter', 'montgomery-silver', function(e){
        generatePopup(e, popup)
    })

    // leave desigation layers and rever back to og mouse 
    map.on('mouseleave', 'bronze-designation', function(e){
        map.getCanvas().style.cursor = ''
        popup.remove()
    })
    map.on('mouseleave', 'silver-designation', function(e){
        map.getCanvas().style.cursor = ''
        popup.remove()
    })
    map.on('mouseleave', 'gold-designation', function(e){
        map.getCanvas().style.cursor = ''
        popup.remove()
    })
    map.on('mouseleave', 'pending-designation', function(e){
        map.getCanvas().style.cursor = ''
        popup.remove()
    })
    map.on('mouseleave', 'camden-bronze', function(e){
        map.getCanvas().style.cursor = ''
        popup.remove()
    })
    map.on('mouseleave', 'montgomery-silver', function(e){
        map.getCanvas().style.cursor = ''
        popup.remove()
    })

    // clicking a layer brings you to the corresponding accordion and opens it (if it exists)
    map.on('click', 'bronze-designation', function(e){
        scrollToAccordion(e)
    })
    map.on('click', 'silver-designation', function(e){
        scrollToAccordion(e)
    })
    map.on('click', 'gold-designation', function(e){
        scrollToAccordion(e)
    })
    map.on('click', 'pending-designation', function(e){
        scrollToAccordion(e)
    })
    map.on('click', 'camden-bronze', function(e){
        scrollToAccordion(e)
    })
    map.on('click', 'montgomery-silver', function(e){
        scrollToAccordion(e)
    })
})

map.fitBounds([[-76.09405517578125, 39.49211914385648],[-74.32525634765625,40.614734298694216]]);


/****** Accordion stuff ******/
const accordions = document.querySelectorAll('.accordion') 
const length = accordions.length

const customToggle = function(accordion){

    // show/hide the accordions on click
    accordion.classList.toggle('active')

    // toggle the aria-expanded attribute of the accordion button
    let ariaExpandedBool = accordion.getAttribute('aria-expanded')
    ariaExpandedBool === 'false' ? ariaExpandedBool = 'true' : ariaExpandedBool = 'false'
    accordion.setAttribute('aria-expanded', ariaExpandedBool)

    // toggle the aria-hidden attribute of the accordion panel
    const panel = accordion.nextElementSibling
    let ariaHiddenBool = panel.getAttribute('aria-hidden')
    ariaHiddenBool === 'false' ? ariaHiddenBool = 'true' : ariaHiddenBool = 'false'
    panel.setAttribute('aria-hidden', ariaHiddenBool)

    // show/hide the panel on click
    if(panel.style.maxHeight){
        panel.style.maxHeight = null
    }else{
        panel.style.maxHeight = panel.scrollHeight + 'px'
    }
}

for(var i = 0; i < length; i++){
    accordions[i].onclick = function(){
        customToggle(this)
    }
}


// handle map toggle
const toggle = document.getElementById('map-toggle-form')
toggle.onchange = function(e) {
    const layer = e.target.id

    // toggle visibility
    if(layer === 'counties') {

        // hide the municipal layers
        map.setLayoutProperty('gold-designation', 'visibility', 'none')
        map.setLayoutProperty('silver-designation', 'visibility', 'none')
        map.setLayoutProperty('bronze-designation', 'visibility', 'none')
        map.setLayoutProperty('pending-designation', 'visibility', 'none')

        // show the county layers
        map.setLayoutProperty('camden-bronze', 'visibility', 'visible')
        map.setLayoutProperty('montgomery-silver', 'visibility', 'visible')

        // toggle active outlines
        map.setFilter('active-outline', activeCounty)
    }else{

        // show the municipal layers
        map.setLayoutProperty('gold-designation', 'visibility', 'visible')
        map.setLayoutProperty('silver-designation', 'visibility', 'visible')
        map.setLayoutProperty('bronze-designation', 'visibility', 'visible')
        map.setLayoutProperty('pending-designation', 'visibility', 'visible')

        // hide the county layers
        map.setLayoutProperty('camden-bronze', 'visibility', 'none')
        map.setLayoutProperty('montgomery-silver', 'visibility', 'none')

        // toggle active outlines
        map.setFilter('active-outline', active)

    }
}