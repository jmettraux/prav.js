
#
# Testing prav.js
#
# Mon Dec 29 10:59:39 JST 2025
#

group 'PravParser' do

  PRAV_TREES =
    File.read('test/_prav_trees.txt')
      .gsub(/\\\n/, '')
      .split("\n")
      .collect(&:strip)
      .collect { |l| m = l.match(/^(.*)(#.*)$/); m ? m[1].strip : l }
      .select { |l| l.length > 0 && l[0, 1] != '#' }
      .collect { |l| l.split(/\s*⟶\s*/) }

  setup do

    @browser = make_browser
  end

  test 'sanity' do

    assert @browser.evaluate('1 + 1'), 2
  end

  group 'parsing' do

    PRAV_TREES.each do |code, tree|

      if tree == '∅'

        test ">#{code}< does not parse" do

          assert_nil @browser.eval("PravParser.parse(#{code.inspect})")
        end

      else

        test ">#{code}< parses" do

          pp(
            @browser.eval("PravParser.parse(#{code.inspect}, { debug: 2 })")
          ) if @browser.eval("PravParser.parse(#{code.inspect})") != eval(tree)

          assert(
            @browser.eval("PravParser.parse(#{code.inspect})"),
            eval(tree))
        end
      end
    end

    test 'does strip the input' do

      assert(
        @browser.eval("Prav.parse('true')"),
        [ 'BOO', true ])
      assert(
        @browser.eval("Prav.parse(' true ')"),
        [ 'BOO', true ])
      assert(
        @browser.eval("Prav.parse('\\ntrue\\n')"),
        [ 'BOO', true ])

      assert(
        @browser.eval("Prav.parse('\\ntrue|false\\n')"),
        ["OR", ["BOO", true], ["BOO", false]])
      assert(
        @browser.eval("Prav.parse('\\ntrue\\n|false\\n')"),
        ["OR", ["BOO", true], ["BOO", false]])
      assert(
        @browser.eval("Prav.parse('\\ntrue\\n|\\nfalse\\n')"),
        ["OR", ["BOO", true], ["BOO", false]])
    end
  end
end

