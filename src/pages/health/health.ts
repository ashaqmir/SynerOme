import { Component } from '@angular/core';
import { Health } from '@ionic-native/health';
import { Platform } from 'ionic-angular/platform/platform';


@Component({
  selector: 'page-health',
  templateUrl: 'health.html'
})
export class HealthPage {
  height: number;
  currentHeight = 'No Data';
  stepcount = 'No Data';
  workouts = [];

  constructor(private health: Health, private platform: Platform) {
    console.log('Health says...')
    this.platform.ready().then(() => {
      this.health.isAvailable().then(available => {
        if (available) {
          console.log(available);

          this.health.requestAuthorization([
            'distance', 'nutrition',  //read and write permissions
            {
              read: ['steps'],       //read only permission
              write: ['height', 'weight']  //write only permission
            }
          ])
            .then(res => {
              console.log(res)
              this.loadHealthData();
            })
            .catch(e => console.log(e));
        }
      }).catch(error => {
        console.log(error);
        this.health.promptInstallFit().then(res => {
          console.log(res);
        }).catch(error => {
          console.log(error);
        })
      })
    });
  }

  // Save a new height
  saveHeight() {
    this.health.store({
      startDate: new Date(new Date().getTime() - 8 * 60 * 1000), // three minutes ago
      endDate: new Date(),
      dataType: 'height',
      value: '165',
      sourceName: 'SynerOme',
      sourceBundleId: 'com.SynerOme.Mobile'
    }).then(res => {
      console.log(res);
      this.loadHealthData();
    }).catch(error => {
      console.log(error);
    })

  }

  // Save a new dummy workout
  saveWorkout() {

    let workout = {
      startDate: new Date(new Date().getTime() - 3 * 60 * 1000), // three minutes ago
      endDate: new Date(),
      dataType: 'steps',
      value: '180',
      sourceName: 'SynerOme',
      sourceBundleId: 'com.SynerOme.Mobile'
    };

    this.health.store(workout).then(res => {
      console.log(res);
      this.loadHealthData();
    }).catch(error => {
      console.log(error);
    })


    this.health.store(workout).then(res => {
      this.loadHealthData();
    })
  }

  // Reload all our data
  loadHealthData() {

    this.health.query({
      startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // three days ago
      endDate: new Date(), // now
      dataType: 'height'
    }).then(res => {
      this.currentHeight = res.value;
    }).catch(error => {
      console.log('No height: ', error);
    })


    this.health.queryAggregated({
      startDate: new Date(new Date().getTime() - 3 * 24 * 60 * 60 * 1000), // three days ago
      endDate: new Date(), // now
      dataType: 'steps',
      bucket: 'day'
    }).then(res => {
      // let stepSum = res.reduce((a, b) => a.value + b.value, 0);
      // this.stepcount = stepSum;
      console.log('No steps: ', res);
    }).catch(error => {
      console.log('No steps: ', error);
    })
  }

  ngOnInit() {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    console.log('Health ...')
  }
}