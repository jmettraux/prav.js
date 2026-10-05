
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

      test ">#{code}< with #{ctx} evaluates to #{expected}" do

        co = JSON.dump(code)
        ct = ctx

        r = @browser.eval("Prav.eval(#{co}, #{ct})")

        assert r, eval(expected)
      end
    end
  end

  test 'trims the input' do

    assert @browser.eval("Prav.eval('true', {})"), true
    assert @browser.eval("Prav.eval(' true ', {})"), true
    assert @browser.eval("Prav.eval(' \\ntrue \\n', {})"), true
    assert @browser.eval("Prav.eval(' \\ntrue\\n & \\n false \\n', {})"), false
  end

  group 'assignments modify the context' do

    { 'a=1;a' => { 'a' => 1 },
      'a = 2; a' => { 'a' => 2 },
      'a = true; a' => { 'a' => true },
      'a = `a`; a' => { 'a' => 'a' },

    }.each do |k, v|

      test "#{k.inspect} leaves #{v.inspect}" do

        assert(
          @browser.eval(
            "(function() { ctx = {}; Prav.eval('#{k}', ctx); " +
            "return ctx; })()"),
          v)
      end
    end
  end
end

