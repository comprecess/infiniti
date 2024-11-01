<?php


namespace Database\Seeders\normalization;


use Symfony\Component\Console\Output\ConsoleOutput;

class Data
{
    public $value = [];
    private $console;

    public function __construct()
    {
        $this->console = new ConsoleOutput();
    }

    public function __get(string $name)
    {
        // TODO: Implement __get() method.
        return $this->value[$name] ?? null;
    }

    public function __set(string $name, $value): void
    {
        // TODO: Implement __set() method.
        $this->set($name, $value);
    }

    public function set(string $name, mixed $value)
    {
        $this->console->writeln("SET: {$name}");
        $this->value[$name] = $value;
        return $this;
    }

    public function is(string $name, callable $callable)
    {
        if(isset($this->value[$name]) && $this->value[$name]) {
            $this->console->writeln("IS: {$name}");
            $callable();
        }

        return $this;
    }

    public function isCreated(string $name, callable $callable)
    {
        if(isset($this->value[$name]) && !$this->value[$name]) {
            $callable();
        }

        return $this;
    }

}
