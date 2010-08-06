require "jruby"
require "stringio"
require 'socket'
require 'camping'
require 'rack'

def js_eval(str)
  JRUBY_APPLET.window.eval(str)
end

class Rack::Handler::WEBrick
  def self.running?
    !!@server
  end
end

module TryCamping
  extend self
  
  class Console
    LVAR_CAPTURE = "local_variables.inject({}) { |m, e| m[e] = eval(e); m }"
    
    def initialize
      @lvars = {}
      @binding = eval("empty_binding", TOPLEVEL_BINDING)
    end
    
    def run(code)
      code = TryCamping.unpack(code)
      
      @lvars.each do |name, value|
        eval("#{name} = nil", @binding)
        eval("lambda { |v| #{name} = v }", @binding).call(value)
      end
      
      dummy = StringIO.new
      stdout, $stdout = $stdout, dummy
      
      res = eval(code, @binding)
      
      $stdout = stdout
      
      eval("_ ||= nil;lambda { |v| _ = v}", @binding).call(res)
      
      "y#{dummy.string}=> #{res.inspect}"
    rescue Exception => e
      "n#{e.class}: #{e}"
    ensure
      @lvars = eval(LVAR_CAPTURE, @binding)
    end
  end
  
  def run(code)
    eval(unpack(code), TOPLEVEL_BINDING)
  end
  
  def unpack(code)
    code.gsub(/%(..)/) { $1.hex.chr }
  end
  
  def invalid?(code)
    code = unpack(code)
    begin
      JRuby.parse(code, "app.rb")
      ""
    rescue SyntaxError => e
      return e.to_s
    end
  end
  
  # Checks if the port is open.
  def port_open?(port)
    server = TCPServer.new("0.0.0.0", port)
    return true
  rescue Exception
    return false
  ensure
    begin
      server.close
    rescue Exception
    end
  end
  
  def port
    @port ||= js_eval("App.port").to_i
  end
  
  def port=(p)
    @port = p.to_i
    js_eval("App.port = #{@port}")
  end
  
  def find_open_port!
    until port_open?(port)
      self.port += 1
    end
  end
  
  def app
    if defined?(App)
      App
    else
      Camping::Apps.first || empty_app
    end
  end
  
  def empty_app
    proc do |env|
      [
        500,
        {},
        ["<h1>Could not load any apps</h1>"],
      ]
    end
  end
  
  def boot
    find_open_port!
    Camping::Apps.each { |app| app.create if app.respond_to?(:create) }
    
    Thread.new do
      Rack::Handler::WEBrick.run(app, :Host => '0.0.0.0', :Port => port)
    end
  end
  
  def cleanup
    if Rack::Handler::WEBrick.running?
      Rack::Handler::WEBrick.shutdown
    end
  end
  
  def watch_io(io)
    Thread.new do
      while true
        if io.pos > 0
          str = Rack::Utils.escape(io.string).tr("+", " ")
          js_eval("App.input(#{str.inspect})")
          io.truncate(0)
          io.rewind
        end
        
        sleep 0.1
      end
    end
  end
end

def empty_binding; binding; end

# Route $stderr and $stdout to the console using StringIO:
$stdout = StringIO.new
$stderr = StringIO.new

TryCamping.watch_io($stdout)
TryCamping.watch_io($stderr)

$C = TryCamping::Console.new
