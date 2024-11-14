<?php


namespace App\Models\Resident\Invoices\Status;

use App\Models\Resident\Invoices\Offer as OfferModel;


class Offer
{
    public function __construct(
        protected OfferModel $offer
    )
    {
    }

    public function actionPublic() :bool
    {
        return !in_array($this->offer->stage, [OfferModel::STAGE[2], OfferModel::STAGE[3]]);
    }
}
