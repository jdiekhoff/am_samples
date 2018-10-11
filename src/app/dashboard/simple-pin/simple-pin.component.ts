import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AtlasMapComponent, LoadMapService} from "@acaisoft/angular-azure-maps";
import {AmFeature} from "@acaisoft/angular-azure-maps/src/azure-map/interfaces/am-feature";
import {dataMock} from "../../data";
import {KeyService} from "../Utils/key.service";

@Component({
  selector: 'app-simple-pin',
  templateUrl: './simple-pin.component.html',
  styleUrls: ['./simple-pin.component.css']
})
export class SimplePinComponent implements OnInit, OnDestroy {

  @ViewChild('maper') maper: AtlasMapComponent;

  config: any = {
    'zoom': 1.5,
    'center': [-20,20],
    'interactive': true,
  };
  key: string = 'tTk1JVEaeNvDkxxnxHm9cYaCvqlOq1u-fXTvyXn2XkA';
  featuresArray: AmFeature[] = [];


  constructor(private mapService: LoadMapService,
              private keyService: KeyService) {
  }


  ngOnInit() {
    /**
     * You need add your key go display map or use API
     */
    this.key = this.keyService.getKey();

    /**
     * That way to lazy load map
     */

    this.mapService.load().toPromise().then(() => {
      atlas.setSubscriptionKey(this.key);
    })
  }

  getPos($event) {
    console.log('GEOCORDS: ', $event)
  }

  initPoint() {
    dataMock.forEach(value => {
      this.featuresArray.push(this.mergeDataPoint(value))
    });
    this.maper.createPoints(this.featuresArray);
    console.log('Thats your features Array: ', this.featuresArray)
    this.maper.createPopups(this.featuresArray);
  }

  init() {
    this.initPoint()
  }

  updatePoints() {
    this.maper.updatePoints(this.featuresArray)
  }

  removePoints() {
    this.maper.map.removeLayers(this.maper.findUniqueLayers(this.featuresArray))
  }


  dataPointsInit(data): atlas.data.Feature {
    /**
     * Azure notation of position: [LONGITUDE, LATITUDE] [-180, 180] [-90, 90]
     * @type atlas.data.Position
     */
    const pos = new atlas.data.Position(data.localization.lng, data.localization.lnt);
    const point = new atlas.data.Point(pos);
    let icon = 'pin-red'
    if(data.type === 'Office')
    {
      icon = 'pin-blue'
    }
    const feature = new atlas.data.Feature(point, {
      icon: icon,
      name: data.name,
      type: data.type,
      title: data.name,
    });
    return feature;
  }

  dataLayerOptions(item): PinLayerOptions {
    const pinOptions: PinLayerOptions = {
      name: item,
      textFont: 'SegoeUi-Bold',
      textOffset: [0, 25],
    };
    return pinOptions;
  }

  mergeDataPoint(data) {
    return {
      dataElement: data,
      atlasFeature: this.dataPointsInit(data),
      layer: data.type,
      pinConfig: this.dataLayerOptions(data.type)
    } as AmFeature
  }

  ngOnDestroy(): void {
    console.log(atlas)
    console.log('MAPI', this.maper)
    this.maper.map.remove()
  }




}
