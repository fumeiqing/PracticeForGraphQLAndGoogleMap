<template>
<div class="autocomplete">
    <div class="input"></div>
    <input type="text" id = 'queryInput' v-model="query" v-text="selected ? selected : ''" placeholder="Start Typing..">
    <div class="options">
        <ul>
            <li :key="match.name"
                v-for="match in matches"
                @click="itemClicked(match)"
                v-text="match.name">
            </li>
        </ul>
    </div>

    <div class="mapDiv">
        <GmapMap 
            class="map"
            :center='mapCenter'
            :zoom='6'
            ref="gmapRef"
        >
        <GmapMarker
            :key="index"
            v-for="(m, index) in markers"
            :position="m.position"
            :clickable="true"
            :draggable="true"
            @click="center=m.position"
        />
        </GmapMap>
    </div>
</div>

</template>

<script>

    import gql from 'graphql-tag'
    import axios from 'axios'
    import {gmapApi} from 'vue2-google-maps'
    
    export default {   
        async mounted() {
            this.$refs.gmapRef.$mapPromise.then((map) => {
                this.map = map;
            }); 
        },    
        apollo: {
            states: gql `query {
                  states{
                    name
                }
            }`
        },
        data() {
            return {
                query: '',
                selected : null,
                markers: [],
                map: null,
                mapCenter: {lat:37, lng:-90}
            };
        },
        computed: {  
            google: gmapApi,         
            matches() {
                if(this.query == '') {
                    return [];
                }
                return this.states.filter((state) => 
                state.name.toLowerCase().includes(this.query.toLowerCase()));
            },           
        },
        methods: {
            itemClicked(match){
                var inputQuery = document.getElementById('queryInput');
                this.selected = match;
                this.query = match.name;
                inputQuery.value = match.name;
                console.log(match.name);
                this.getLocation(match.name);
            },
            getLocation(address) {
                axios.get('https://maps.googleapis.com/maps/api/geocode/json?address='
                + address
                +'&key=AIzaSyBhPd7BLmIlHh2QLQXx1IxysLclsDGG_6E')
                .then(response => {
                    var temp = response.data.results[0].geometry;
                    this.mapCenter = temp.location;
                    this.markers = [
                        {
                        position: temp.location
                        }
                    ]
                    const bounds = new this.google.maps.LatLngBounds(temp.bounds.northeast, temp.bounds.southwest);
                    console.log(bounds);
                    //console.log(temp.bounds.northeast);
                    //this.map.panTo(temp.location);
                    //this.map.panToBounds(bounds);
                    //this.map.fitBounds(bounds);
                    //console.log("scussful");
                }).catch(error => {
                    console.log(error.message)
                })
            }
        },
    }
</script>

<style scoped>
.autocomplete {
    width: 100%;
    position: relative;
}

input {
    height: 40px;
    width: 95%;
    border-radius: 5px;
    border: 2px solid rgb(112, 109, 109);
    padding-left: 10px;
    padding-top: 10px;
    font-size: 30px;
    cursor: text;
}
input placeholder {
    font-size: 30px;
    font-family: monospace;
}
.options {
    max-height: 200px;
    overflow-y: scroll;
}
.options ul {
    list-style-type: none;
    text-align: left;
    padding-left: 15px;

}
.options ul li {
    border-bottom: 1px solid lightgray;
    padding: 10px;
    cursor: pointer;;
    background: rgba(241, 241, 241, 0.5);
}

.options ul li.selected {
    border-bottom: 1px solid lightgray;
    padding: 10px;
    cursor: pointer;;
    background: rgb(18, 29, 41);
}

.options ul li:not(.selected):hover {
    border-bottom: 1px solid lightgray;
    padding: 10px;
    cursor: pointer;;
    background: rgb(95, 146, 223);
}
.mapDiv {
    position: absolute;
    top: 100px;
    margin-left: 30%;
    z-index: -1;
}
.map {
    width:960px;
    height:640px;
    margin-top: 0;
    margin-left: 30%;
    margin-right: 4%;
    position: absolute;
    align-items: center;
}

</style>