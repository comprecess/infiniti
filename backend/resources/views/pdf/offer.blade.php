<?php
$config = \App\Models\Config::class;
$rtl = $config::get('rtl');
$user = $model->user;
$company = $user->companyClient;
$offer = $model->offer;
$taxIndia = $config::get('tax_system') == 'India';
$colSpan = 2;
if($taxIndia) {
    $colSpan = $model->is_same_state ? 6 : 5;
}

$items = $model->items;
$transactions = $model->transaction;

$colSpan = 2;

$dateFormat = $config::get('df');

?>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <style>
        /** { font-family: dejavusanscondensed, DejaVu Sans, sans-serif; }*/

        @font-face {
            font-family: 'DejaVu Sans';
            src: url({{public_path('/style/font/dejavusans/DejaVuSansCondensed.woff2')}}) format('woff2'), url({{public_path('/style/font/dejavusans/DejaVuSansCondensed.woff')}}) format('woff');
            font-weight: 400;
            font-style: normal;
        }

        * {
            font-size: 14px/1.4;
            font-family: dejavusanscondensed, DejaVu Sans, sans-serif;
        }

        /*#page-wrap { width: 800px; margin: 0 auto; }*/

        table { border-collapse: collapse; }
        table td, table th { border: 1px solid black; padding: 5px; }


        #customer { overflow: hidden; }

        #logo { text-align: right; float: right; position: relative; margin-top: 25px; border: 1px solid #fff; max-width: 540px; overflow: hidden; }

        /*#meta { margin-top: 1px; width: 100%; float: right; }*/
        /*#meta td { text-align: right;  }*/
        /*#meta td.meta-head { text-align: left; background: #eee; }*/
        /*#meta td textarea { width: 100%; height: 20px; text-align: right; }*/

        #items { clear: both; width: 100%; margin: 30px 0 0 0; border: 1px solid black; }
        #items th { background: #eee; }
        #items textarea { width: 80px; height: 50px; }
        #items tr.item-row td {  vertical-align: top; }
        #items td.description { width: 300px; }
        #items td.item-name { width: 175px; }
        #items td.description textarea, #items td.item-name textarea { width: 100%; }
        #items td.total-line { border-right: 0; text-align: right; }
        #items td.total-value { border-left: 0; padding: 10px; }
        #items td.total-value textarea { height: 20px; background: none; }
        #items td.balance { background: #eee; }
        #items td.blank { border: 0; }
        .meta-head{background: #EEEEEE}

        #terms { text-align: left; margin: 20px 0 0 0; }
        #terms h5 { text-transform: uppercase; font-size: 13px; letter-spacing: 10px; border-bottom: 1px solid black; padding: 0 0 8px 0; margin: 0 0 8px 0; }
        #terms textarea { width: 100%; text-align: center;}

        @if($rtl == 1)

        html body {
            direction: rtl;
        }
        table td, table th {
            text-align: right;
        }

        @else

            #items td.blank { border: 0; }

        @endif

    </style>
</head>
<body>

<div id="page-wrap">

    <table width="100%">
        <tr>
            <td style="border: 0;  text-align: left" >
                <span style="font-size: 18px; color: #2f4f4f"><strong>{{__('pdf.offer.Offer')}} # {{$model->getCode()}}</strong></span>
            </td>
            <td style="border: 0;  text-align: right">
                    <br> <br>
                    {{$config::get('CompanyName')}} <br>
                    {!! $config::get('caddress') !!}
                </td>
        </tr>
    </table>

    <hr>
    <div style="clear:both"></div>

    <div id="customer">

        <table id="meta">
            <tr>
                @if($model->check_public)
                <td style="border: 1px solid white; text-align: left;" width="400px">

                    @if($model->title)
                        <h4>{{$model->title}}</h4> <br>
                    @endif

                    @if($model->receipt_number)
                        <h4>{{__('pdf.invoice.number')}}: {{$model->receipt_number}}</h4><br>
                    @endif

                    <strong>{{__('pdf.invoice.invoiceTo')}}</strong> <br>
                    @if($company)
                        {{$company->company_name}}
                        @if($config::get('show_business_number') == 1 && $company->business_number)
                            {{$config::get('label_business_number')}}: {{$company->business_number }}<br>
                        @endif
                        {{__('pdf.invoice.attn')}}: {{$user->account}} <br>
                    @else
                        {{$user->account}} <br>
                    @endif

                    {!! $user->getFullAddress('<br>') !!}<br>

                    @foreach(['phone', 'fax', 'email'] as $name)
                        {{__('pdf.invoice.'.$name)}}: {{($user->{$name})}}<br>
                    @endforeach

                    @foreach($user->getCustomFieldsValues() as $fields)
                        @if($fields->value)
                            {{$fields->fieldname}}: {{$fields->value}}
                        @endif
                    @endforeach
                    </td>
                @endif
                    <td style="border: 1px solid white; text-align: left;" width="{{$model->check_public ? '285px' : '685px'}}">
                        <table width="100%">
                            <tr>
                                <td class="meta-head">{{__('pdf.offer.Offer')}} #</td>
                                <td style="text-align: right">{{$model->getCode()}}</td>
                            </tr>
                            <tr>

                                <td class="meta-head">{{__('pdf.invoice.status')}}</td>
                                <td style="text-align: right">{{__('pdf.offer.stageVar.' . $model->stage)}}</td>
                            </tr>
                            <tr>

                                <td class="meta-head">{{__('pdf.offer.Date Created')}}</td>
                                <td style="text-align: right">{{$model->datecreated?->format($dateFormat)}}</td>
                            </tr>
                            <tr>
                                <td class="meta-head">{{__('pdf.offer.Expiry Date')}}</td>
                                <td style="text-align: right">{{$model->validuntil?->format($dateFormat)}}</td>
                            </tr>

                            <tr>
                                <td class="meta-head">{{__('pdf.invoice.Total')}}</td>
                                <td style="text-align: right"><div class="due">{{$model->total}}</div></td>
                            </tr>
                        </table>
                    </td>

        </table>

    </div>

    <hr>

    <strong>{{$model->subject}}</strong>

    @if($model->proposal)
        <hr>
        <div>
            {!! $model->proposal !!}
        </div>
        <hr>
    @endif


    <table id="items">

        <tr>
            <th >{{__('pdf.invoice.Item')}}</th>

            <th align="right">{{__('pdf.invoice.Price')}}</th>


            <th align="right">
                @if(!$model->show_quantity_as || $model->show_quantity_as == 1)
                    {{__('pdf.invoice.Qty')}}
                @else
                    {{$model->show_quantity_as}}
                @endif
            </th>

            <th align="right">{{__('pdf.invoice.Total')}}</th>

        </tr>

        @foreach($items as $item)
            <tr class="item-row">
                <td class="description">{!! $item->description !!}</td>
                <td align="right">{{$item->amount}}</td>
                <td align="right">{{$item->qty}}</td>
                <td align="right"><span class="price">{{$item->getSumm()}}</span></td>
            </tr>
        @endforeach


        <tr>
            <td class="blank"> </td>
            <td colspan="{{$colSpan}}" class="total-line">{{__('pdf.invoice.Sub Total')}}</td>
            <td class="total-value"><div id="subtotal">{{$items->summPrice()}}</div></td>
        </tr>

        <tr>
            <td class="blank"> </td>
            <td colspan="{{$colSpan}}" class="total-line">{{__('pdf.invoice.Discount')}}
            </td>
            <td class="total-value"><div id="subtotal">{{$items->summDiscount()}}</div></td>
        </tr>
        <tr>

            <td class="blank"> </td>
            <td colspan="{{$colSpan}}" class="total-line">{{__('pdf.invoice.TAX')}}</td>
            <td class="total-value"><div id="total">{{$items->summTax()}}</div></td>
        </tr>

        @if($model->credit)
            <tr>
                <td class="blank"> </td>
                <td colspan="{{$colSpan}}" class="total-line">{{__('pdf.invoice.Invoice Total')}}</td>
                <td class="total-value"><div class="due">{{$model->total}}</div></td>
            </tr>
            <tr>
                <td class="blank"> </td>
                <td colspan="{{$colSpan}}" class="total-line">{{__('pdf.invoice.Total Paid')}}</td>
                <td class="total-value"><div class="due">{{$model->credit}}</div></td>
            </tr>
            <tr>
                <td class="blank"> </td>
                <td colspan="{{$colSpan}}" class="total-line balance">{{__('pdf.invoice.Amount Due')}}</td>
                <td class="total-value balance"><div class="due">{{$model->duty()}}</div></td>
            </tr>
        @else

            <tr>
                <td class="blank"> </td>
                <td colspan="{{$colSpan}}" class="total-line balance">{{__('pdf.invoice.Grand Total')}}</td>
                <td class="total-value balance"><div class="due">{{$model->total}}</div></td>
            </tr>

        @endif

    </table>

    @if($model->customernotes)
        <hr>
        <div>
            {!! $model->customernotes !!}
        </div>
    @endif


</div>

</body>
</html>
