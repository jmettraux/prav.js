
require 'json'


PRAV_EVALS =
  File.read('test/_prav_evals.txt')
    .split("\n")
    .collect(&:strip)
    .collect { |l| m = l.match(/^(.*)(#.*)$/); m ? m[1].strip : l }
    .select { |l| l.length > 0 && l[0, 1] != '#' }
    .collect { |l|
      ss = l.split(/\s*⟶\s*/)
      ss.insert(1, '{}') if ss.length < 3
      ss }

#pp PRAV_EVALS

puts "```js"

PRAV_EVALS.each do |cod, ctx, out|

  out = JSON.dump(Kernel.eval(out))

  puts "Prav.eval(#{cod.inspect}, #{ctx}) // --> #{out}"
end

puts "```"

