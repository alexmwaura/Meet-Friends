<Accordion>
<Link to="/">
 
      <Button
        icon="home"
        label="Home"
        labelPosition="right"
        size="large"
        secondary
      />
    

  </Link>
   <Segment>
   <Accordion.Title
      active={activeIndex === 1}
      index={1}
      onClick={this.setActiveIndex}
    >
      <Icon name="dropdown" />
      Buttons
    </Accordion.Title>
    <Accordion.Content active={activeIndex === 1}>
      <Accordion.Title
        active={activeIndexTwo === 1}
        index={1}
        onClick={this.setActiveIndexTwo}
      >
        Chat <Icon name="chat" color="green" />
      </Accordion.Title>
      <Accordion.Content
        active={activeIndexTwo === 1}
        className="animated fadeInDown delay-0.5s"
      >
        <ChatButton />
      </Accordion.Content>

      <Accordion.Title
        active={activeIndexTwo === 2}
        index={2}
        onClick={this.setActiveIndexTwo}
      >
        Share <Icon name="share alternate" />
      </Accordion.Title>
      <Accordion.Content
        active={activeIndexTwo === 2}
        className="animated fadeInRight delay-0.5s"
      >
        Share form
      </Accordion.Content>
    </Accordion.Content>

    </Segment>

  <Segment>
  <Accordion.Title
      active={activeIndex === 2}
      index={2}
      onClick={this.setActiveIndex}
    >
      <Icon name="setting" />
      Advanced
    </Accordion.Title>
    <Accordion.Content
      active={activeIndex === 2}
      className="animated fadeInUp"
    >
      Addvanced Settings Component
    </Accordion.Content>
  
  </Segment>
</Accordion>