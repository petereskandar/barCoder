/**
 * Created by eskandar.peter on 10/01/2017.
 */
export class barcodeResult {
  constructor(
    public barCode: String,
    public format: String,
    public description? : string,
    public price? : number,
    public category? : string
  ) {}
}
