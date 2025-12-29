
#
# Testing prav.js
#
# Mon Dec 29 10:59:39 JST 2025
#

group 'Prav' do

  PRAV_EVALS =
    File.read('test/_prav_evals.txt')
      .split("\n")
      .collect(&:strip)
      .collect { |l| m = l.match(/^(.*)(#.*)$/); m ? m[1].strip : l }
      .select { |l| l.length > 0 && l[0, 1] != '#' }
      .collect { |l|
        ss = l.split(/\s*⟶\s*/)
        ss.insert(1, {}) if ss.length < 3
        ss }

  setup do

    @browser = make_browser
  end

  test 'sanity' do

    assert @browser.evaluate('1 + 1'), 2
  end

  group 'evaluating' do

    PRAV_EVALS.each do |code, ctx, expected|

      test ">#{code}< evaluates to #{expected.inspect}" do

        puts '---'; p code; p ctx; p expected
        #puts "Prav.eval(#{JSON.dump(code)}, #{JSON.dump(ctx)})"
        r = @browser.eval  "Prav.eval(#{JSON.dump(code)}, #{JSON.dump(ctx)})"
        p r
      end
    end
  end
end

