import { Component, OnInit } from '@angular/core';
import { DataLocalService } from '../../services/data.local.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {

  constructor(public dataLocalService : DataLocalService) { }

  ngOnInit() {
  }

}
