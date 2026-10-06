
#
# Testing prav.js
#
# Wed Oct  7 08:04:04 JST 2026
#

group 'Prav' do

  setup do

    @browser = make_browser
  end

  group '.compile' do

    test 'compiles prav code to a function' do

      assert @browser.eval("typeof Prav.compile('true')"), 'function'
    end

    test 'compiles to a callable function' do

      assert @browser.eval("Prav.compile('true')({})"), true
      assert @browser.eval("Prav.compile('a')({ a: 'alpha' })"), 'alpha'
    end
  end
end

