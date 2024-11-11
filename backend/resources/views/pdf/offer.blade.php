@extends('pdf.tmp.index-mpdf')

@section('content')

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
<div id="page-wrap">

    @include('pdf.tmp.conpany-info',['nameModel' => __('pdf.offer.OFFER'), 'codeModel' => $model->getCode()])

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
@endsection
