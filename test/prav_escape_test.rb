
#
# Testing prav.js
#
# Sun Oct  4 09:18:51 JST 2026
#

group 'Prav' do

  setup do

    @browser = make_browser
  end

  ESCAPEES = {
    'foo' => 'foo',
    'foo&quot;bar' => 'foo"bar',
      }
  ESCAPERS =
    ESCAPEES.inject({}) { |h, (k, v)| h[v] = k; h }


  group '.escape(s)' do

    ESCAPERS.each do |src, tgt|

      test "turns >#{src}< into >#{tgt}<" do

        assert @browser.eval("Prav.escape(#{JSON.dump(src)})"), tgt
      end
    end
  end

  group '.unescape(s)' do

    ESCAPEES.each do |src, tgt|

      test "turns >#{src}< into >#{tgt}<" do

        assert @browser.eval("Prav.unescape(#{JSON.dump(src)})"), tgt
      end
    end
  end
end

