<?php


namespace App\Models\Traits;


trait DateLangTrait
{

    protected function plural($n) {
        return ($n > 1) && ($n < 5) && (~~($n / 10) !== 1);
    }

    public function translate($number, $withoutSuffix, $key, $isFuture)
    {
        $result = $number . ' ';
        switch ($key) {
            case 's':  // a few seconds / in a few seconds / a few seconds ago
                return ($withoutSuffix || $isFuture) ? 'pár sekund' : 'pár sekundami';
            case 'm':  // a minute / in a minute / a minute ago
                return $withoutSuffix ? 'minuta' : ($isFuture ? 'minutu' : 'minutou');
            case 'mm': // 9 minutes / in 9 minutes / 9 minutes ago
                if ($withoutSuffix || $isFuture) {
                    return $result . (($this->plural($number) ? 'minuty' : 'minut'));
                } else {
                    return $result . 'minutami';
                }
                break;
            case 'h':  // an hour / in an hour / an hour ago
                return $withoutSuffix ? 'hodina' : ($isFuture ? 'hodinu' : 'hodinou');
            case 'hh': // 9 hours / in 9 hours / 9 hours ago
                if ($withoutSuffix || $isFuture) {
                    return $result . (($this->plural($number) ? 'hodiny' : 'hodin'));
                } else {
                    return $result . 'hodinami';
                }
                break;
            case 'd':  // a day / in a day / a day ago
                return ($withoutSuffix || $isFuture) ? 'den' : 'dnem';
            case 'dd': // 9 days / in 9 days / 9 days ago
                if ($withoutSuffix || $isFuture) {
                    return $result . ($this->plural($number) ? 'dny' : 'dní');
                } else {
                    return $result . 'dny';
                }
                break;
            case 'M':  // a month / in a month / a month ago
                return ($withoutSuffix || $isFuture) ? 'měsíc' : 'měsícem';
            case 'MM': // 9 months / in 9 months / 9 months ago
                if ($withoutSuffix || $isFuture) {
                    return $result . ($this->plural($number) ? 'měsíce' : 'měsíců');
                } else {
                    return $result . 'měsíci';
                }
                break;
            case 'y':  // a year / in a year / a year ago
                return ($withoutSuffix || $isFuture) ? 'rok' : 'rokem';
            case 'yy': // 9 years / in 9 years / 9 years ago
                if ($withoutSuffix || $isFuture) {
                    return $result . ($this->plural($number) ? 'roky' : 'let');
                } else {
                    return $result . 'lety';
                }
                break;
        }
    }
}
